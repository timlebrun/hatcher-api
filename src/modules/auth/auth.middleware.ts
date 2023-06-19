import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction as ExpressNextFunction } from 'express';
import { HatcherAuthService, IHatcherAuthServiceTokenInfo } from './auth.service';
import { IncomingMessage } from 'http';

@Injectable()
export class HatcherAuthMiddleware implements NestMiddleware {
	private static readonly bearerTokenRegex = /bearer (?<token>[\w\-_+/.]+)/i;
	private static readonly webSocketProtocolTokenRegex = /hatcher<(?<token>[\w\-_+/.]+)>/i;

	constructor(private readonly service: HatcherAuthService) {}

	/**
	 * Silently tries to resolve authentication data from the request
	 *
	 * Adds the data to the request if succeeded
	 */
	public async use(request: IncomingMessage, response: Response, next: ExpressNextFunction) {
		const requestAccessTokenInfo = this.extractAndVerifyRequestAccessTokenInfo(request);
		if (requestAccessTokenInfo) request.token = requestAccessTokenInfo;

		// console.debug('MIDDLEWARE', request.url, requestAccessTokenInfo, typeof request);

		return next();
	}

	public extractAndVerifyRequestAccessTokenInfo(
		request: IncomingMessage,
	): IHatcherAuthServiceTokenInfo {
		const requestAccessToken = HatcherAuthMiddleware.maybeExtractTokenFrom(request);
		console.log({ requestAccessToken });
		if (!requestAccessToken) return null;

		const verifiedTokenInfo = this.service.verifyAccessToken(requestAccessToken);
		console.log({ verifiedTokenInfo });

		return verifiedTokenInfo ?? null;
	}

	/**
	 * Will attempt to extract a bearer token from the request
	 *
	 * @param request
	 * @returns either the matched token or null
	 */
	public static maybeExtractAuthorizationBearerFrom(request: IncomingMessage): string | null {
		const authorizationHeader = request.headers.authorization;
		if (!authorizationHeader) return null;

		const tokenMatch = this.bearerTokenRegex.exec(authorizationHeader);
		if (!tokenMatch) return null;

		return tokenMatch.groups.token || null;
	}

	/**
	 * Will attempt to extract a bearer token from the request
	 *
	 * @param request
	 * @returns either the matched token or null
	 */
	public static maybeExtractWebSocketTokenFrom(request: IncomingMessage): string | null {
		const webSocketProtocolHeaders = request.headers['sec-websocket-protocol'] || [];
		const webSocketProtocolHeader = Array.isArray(webSocketProtocolHeaders)
			? webSocketProtocolHeaders[0]
			: webSocketProtocolHeaders;

		if (!webSocketProtocolHeader) return null;
		
		const decodedWebSocketProtocolHeader = decodeURIComponent(webSocketProtocolHeader);

		const tokenMatch = this.webSocketProtocolTokenRegex.exec(decodedWebSocketProtocolHeader);
		if (!tokenMatch) return null;

		return tokenMatch.groups.token || null;
	}

	public static maybeExtractTokenFrom(request: IncomingMessage) {
		const authorisationHeaderBearerToken = this.maybeExtractAuthorizationBearerFrom(request);
		if (authorisationHeaderBearerToken) return authorisationHeaderBearerToken;

		const webSocketHeaderToken = this.maybeExtractWebSocketTokenFrom(request);
		if (webSocketHeaderToken) return webSocketHeaderToken;

		return null;
	}
}

// Adds 'token' property globally to Express and basic http request

declare global {
	namespace Express {
		// introduce another declaration of interface Express.User which will merge with any others
		interface Request {
			token?: IHatcherAuthServiceTokenInfo | null;
		}
	}
}

declare module 'http' {
	interface IncomingMessage {
		token?: IHatcherAuthServiceTokenInfo | null;
	}
}
