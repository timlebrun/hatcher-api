import { createHmac, randomBytes } from 'crypto';
import * as uuid from 'uuid';

import { HatcherAuthUserSession, HatcherDatabaseService, Prisma } from 'src/modules/database';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import * as jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

const { HATCHER_AUTH_KEY = 'hehe', HATCHER_AUTH_UUID_NODE = 'hatchr' } = process.env;

@Injectable()
export class HatcherAuthService {
	private static readonly uuidNode = HatcherAuthService.makeLocalUuidNode(
		HATCHER_AUTH_UUID_NODE,
	);

	constructor(private readonly database: HatcherDatabaseService) {}

	public async fetchUser(userId: number) {
		const user = await this.database.hatcherAuthUser.findUnique({
			where: { id: userId },
		});

		return user;
	}

	public async searchUsers(where: Prisma.HatcherAuthUserWhereInput = {}) {
		const users = await this.database.hatcherAuthUser.findMany({ where });

		return users;
	}

	public async listUserSessions(userId: number) {
		const sessions = await this.database.hatcherAuthUserSession.findMany({
			where: { userId },
		});

		return sessions;
	}

	public async maybeFetchSessionByToken(token: string) {
		const session = await this.database.hatcherAuthUserSession.findUnique({
			where: { token },
		});

		if (!session) return null;

		return session;
	}

	public async maybeFetchUser(id: number) {
		const user = await this.database.hatcherAuthUser.findUnique({
			where: { id },
		});

		if (!user) return null;

		return user;
	}

	public async deleteSession(sessionId: number) {
		const deletedSession = await this.database.hatcherAuthUserSession.update({
			where: { id: sessionId },
			data: { deletedAt: new Date() },
		});

		return deletedSession;
	}

	/**
	 * Given user-provided credentials, will either create a session and return it
	 * or return null if something is wrong
	 *
	 * @param userIdentifier User-provided identifier
	 * @param userPassword User-provided password
	 * @param request The incoming request (for origin context)
	 * @returns the created session or null
	 */
	public async maybeCreateSessionFromCredentials(
		userIdentifier: string,
		userPassword: string,
		request: ExpressRequest,
	): Promise<HatcherAuthUserSession | null> {
		const credentialsUser = await this.maybeFetchUserFromCredentials(
			userIdentifier,
			userPassword,
		);
		if (!credentialsUser) return null;

		const sessionToken = HatcherAuthService.makeUniqueToken();
		const sessionOriginAgent = request.header('user-agent');
		const sessionOriginHost = request.ip;

		const session = await this.database.hatcherAuthUserSession.create({
			data: {
				userId: credentialsUser.id,
				token: sessionToken,
				originAgent: sessionOriginAgent,
				originHost: sessionOriginHost,
				originType: null,
			},
		});

		return session;
	}

	public async maybeFetchUserFromCredentials(identifier: string, password: string) {
		const user = await this.database.hatcherAuthUser.findUnique({
			where: { authIdentifier: identifier },
		});

		if (!user) return null;

		const secretMatches = this.checkPassword(password, user.authSecret);
		if (!secretMatches) return null;

		return user;
	}

	private createPasswordSecret(password: string) {
		const cipher = createHmac('sha256', HATCHER_AUTH_KEY);

		const salt = randomBytes(8).toString('hex');
		const payload = `${salt}#${password}`;
		const hash = cipher.update(payload).digest('hex');

		return `${salt}#${hash}`;
	}

	/**
	 * Given a user-provided password and a (probably) database-stored has
	 * will return true if the password matches the secret (salt+hash)
	 *
	 * @param userPassword
	 * @param knownSecret
	 * @returns whether password matches the secret
	 */
	private checkPassword(userPassword: string, knownSecret: string) {
		const cipher = createHmac('sha256', HATCHER_AUTH_KEY);

		const [knownSalt, knownHash] = knownSecret.split('#');

		const userPayload = `${knownSalt}#${userPassword}`;
		const userHash = cipher.update(userPayload).digest('hex');

		return knownHash === userHash;
	}

	public async createUser(data: Prisma.HatcherAuthUserCreateInput) {
		const user = await this.database.hatcherAuthUser.create({ data });

		return user;
	}

	public async modifyPassword(userId: number, newPassword: string) {
		const newSecret = this.createPasswordSecret(newPassword);
		const updatedUser = await this.database.hatcherAuthUser.update({
			where: { id: userId },
			data: { authSecret: newSecret },
		});

		return updatedUser;
	}

	public verifyAccessToken(token: string): IHatcherAuthServiceTokenInfo {
		try {
			const payload = jwt.verify(token, HATCHER_AUTH_KEY) as jwt.JwtPayload;

			const payloadExpiresAt = DateTime.fromSeconds(payload.exp).toJSDate();
			const payloadScopes = payload.scope ? payload.scope.split(' ') : [];

			return {
				userId: +payload.sub,
				userSessionId: payload.sid,
				scopes: payloadScopes,
				expiresAt: payloadExpiresAt,
			};
		} catch (e) {
			return null;
		}
	}

	public buildAccessToken(info: IHatcherAuthServiceTokenInfo) {
		const jwtExp = DateTime.fromJSDate(info.expiresAt).toUnixInteger();

		// TODO: allow key rotation ?
		// TODO: encode JWTs better, maybe event encrypt

		const payload = {
			iss: 'hatchr',
			sid: info.userSessionId,
			sub: info.userId,
			aud: 'huh', // client ID maybe ?
			exp: jwtExp,
		};

		return jwt.sign(payload, HATCHER_AUTH_KEY);
	}

	/**
	 * Generates a 6 bytes long buffer from specified seed
	 *
	 * @returns the 6 byte buffer
	 */
	private static makeLocalUuidNode(seed: string): Buffer {
		const paddedSeed = seed.padStart(6, '0');
		const unboudedBuffer = Buffer.from(paddedSeed);
		const nodeBuffer = unboudedBuffer.slice(0, 6);

		return nodeBuffer;
	}

	/**
	 * Generates a unique "random" string
	 *
	 * Uses 3 namespaced UUIDs re-encoded to base64url
	 */
	public static makeUniqueToken() {
		const firstUuid = uuid.v1({ node: HatcherAuthService.uuidNode });
		const secondUuid = uuid.v1({ node: HatcherAuthService.uuidNode });
		const thirdUuid = uuid.v1({ node: HatcherAuthService.uuidNode });

		const megaUuid = firstUuid + secondUuid + thirdUuid;
		const spinelessMegaUuid = megaUuid.replace(/-/gi, '');

		const uniqueBuffer = Buffer.from(spinelessMegaUuid, 'hex');

		return uniqueBuffer.toString('base64url');
	}
}

export interface IHatcherAuthServiceTokenInfo {
	userId: number;
	userSessionId: number;

	scopes: string[];

	expiresAt: Date;
}
