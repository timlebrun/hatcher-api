import {
	BadRequestException,
	Controller,
	ForbiddenException,
	Get,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common';
import { HatcherAuthService } from './auth.service';
import { ValidatedBody } from '../common/decorators/validation.decorator';
import {
	HatcherAuthOpenidTokenRequestDto,
	HatcherAuthOpenidTokenResponseDto,
	HatcherAuthTokenGrantType,
} from './dtos/openid.dto';
import { Request as ExpressRequest } from 'express';
import { DateTime } from 'luxon';
import { HatcherAuthUserEntity, HatcherAuthUserSigninDto } from './dtos/user.dto';
import { HatcherAuthGuard } from './auth.guard';

@Controller('api/auth')
export class HatcherAuthController {
	constructor(private readonly service: HatcherAuthService) {}

	@Get('me')
	@UseGuards(new HatcherAuthGuard({ requireAuth: true }))
	public async getMe(@Request() request: ExpressRequest): Promise<HatcherAuthUserEntity> {
		if (!request.token) throw new ForbiddenException();

		const user = await this.service.fetchUser(request.token.userId);

		return user as HatcherAuthUserEntity;
	}

	@Get('me/sessions')
	@UseGuards(new HatcherAuthGuard({ requireAuth: true }))
	public async getMySessions(@Request() request: ExpressRequest) {
		if (!request.token) throw new ForbiddenException();

		const sessions = await this.service.listUserSessions(request.token.userId);

		return sessions;
	}

	@Post('logout')
	public async postLogout(@Request() request: ExpressRequest) {
		if (!request.token) throw new ForbiddenException();

		const sessions = await this.service.deleteSession(request.token.userSessionId);

		return sessions;
	}

	@Post('tokens')
	public async postToken(
		@ValidatedBody() body: HatcherAuthOpenidTokenRequestDto,
		@Request() request: ExpressRequest,
	): Promise<HatcherAuthOpenidTokenResponseDto> {
		if (body.grant_type === HatcherAuthTokenGrantType.password)
			return this.postPasswordToken(body.username, body.password, request);

		if (body.grant_type === HatcherAuthTokenGrantType.refreshToken)
			return this.postRefreshToken(body.refresh_token, request);

		throw new BadRequestException();
	}

	private async postPasswordToken(
		userIdentifier: string,
		userPassword: string,
		request: ExpressRequest,
	): Promise<HatcherAuthOpenidTokenResponseDto> {
		const session = await this.service.maybeCreateSessionFromCredentials(
			userIdentifier,
			userPassword,
			request,
		);

		if (!session) throw new BadRequestException(); // TODO: make better compliant errors

		const accessTokenExpirationDateTime = DateTime.now().plus({ minutes: 10 });

		const accessToken = this.service.buildAccessToken({
			userSessionId: session.id,
			userId: session.userId,
			scopes: [],
			expiresAt: accessTokenExpirationDateTime.toJSDate(),
		});

		return {
			token_type: 'bearer',
			refresh_token: session.token,
			access_token: accessToken,

			expires_at: accessTokenExpirationDateTime.toUnixInteger(),
			scope: '',
		};
	}

	private async postRefreshToken(
		refreshToken: string,
		request: ExpressRequest,
	): Promise<HatcherAuthOpenidTokenResponseDto> {
		const session = await this.service.maybeFetchSessionByToken(refreshToken);

		if (!session) throw new ForbiddenException(); // TODO: make proper oauth errors
		if (session.deletedAt) throw new ForbiddenException();

		const accessTokenExpirationDateTime = DateTime.now().plus({ minutes: 10 });

		const accessToken = this.service.buildAccessToken({
			userSessionId: session.id,
			userId: session.userId,
			scopes: [],
			expiresAt: accessTokenExpirationDateTime.toJSDate(),
		});

		return {
			token_type: 'bearer',
			refresh_token: session.token,
			access_token: accessToken,

			expires_at: accessTokenExpirationDateTime.toUnixInteger(),
			scope: '',
		};
	}

	@Post('signin')
	public async postSignin(
		@ValidatedBody() body: HatcherAuthUserSigninDto,
	): Promise<HatcherAuthUserEntity> {
		const maybeSimilarUsers = await this.service.searchUsers({
			authIdentifier: body.authIdentifier,
		});

		if (maybeSimilarUsers.length) throw new BadRequestException();

		const user = await this.service.createUser({
			displayName: body.displayName,
			authIdentifier: body.authIdentifier,
		});

		const updatedUser = await this.service.modifyPassword(user.id, body.authPassword);

		return updatedUser as HatcherAuthUserEntity;
	}

	// TODO: GET users ?
	// TODO: .well-known
}
