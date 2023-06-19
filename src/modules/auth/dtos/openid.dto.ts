import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { TokenSetParameters } from 'openid-client';

export enum HatcherAuthTokenGrantType {
	password = 'password',
	refreshToken = 'refresh_token',
}

export class HatcherAuthOpenidTokenRequestDto {
	@IsString()
	client_id: string;

	@IsEnum(HatcherAuthTokenGrantType)
	grant_type: HatcherAuthTokenGrantType;

	@ValidateIf(o => o.grant_type === HatcherAuthTokenGrantType.password)
    @IsString()
	username?: string;

	@ValidateIf(o => o.grant_type === HatcherAuthTokenGrantType.password)
    @IsString()
	password?: string;

	@ValidateIf(o => o.grant_type === HatcherAuthTokenGrantType.refreshToken)
    @IsString()
	refresh_token?: string;

    @IsOptional()
    @IsString()
	scope: string;
}

export class HatcherAuthOpenidTokenResponseDto implements TokenSetParameters {
	token_type: 'bearer';

	access_token: string;
	refresh_token: string;
	// id_token?: string;

	scope: string;

	expires_at: number;

	[key: string]: unknown; // NOTE: needed for bad TS interface
}
