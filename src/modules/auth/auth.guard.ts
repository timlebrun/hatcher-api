import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { IncomingMessage } from 'http';

/**
 * Helper guard allowing implicit verification of execution context
 */
export class HatcherAuthGuard implements CanActivate {
	constructor(private readonly options: IHatcherAuthGuardOptions = {}) {}

	public canActivate(
		context: ExecutionContext,
	): boolean {
		const contextType = context.getType();

		if (contextType === 'http') return this.canHttpActivate(context);
		if (contextType === 'ws') return this.canWsActivate(context);

		return false; // cannot handle other types
	}

	private canWsActivate(context: ExecutionContext) {
		// extract token from request and check it
		return true;
	}

	private canHttpActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest() as ExpressRequest;

		return this.checkRequestAllowed(request);
	}

	public checkRequestAllowed(request: IncomingMessage) {
		if (!this.options.requireAuth) return true;

		if (!request.token) return false;

		if (this.options.requireScopes)
			for (const scope of this.options.requireScopes)
				if (!request.token.scopes.includes(scope)) return false;

		// TODO: add some permissions i guess

		return true;
	}

	public static verifyWebSocketClient(info: any, callback: any) {

		return callback(null, true);
	} 
}

export interface IHatcherAuthGuardOptions {
	requireAuth?: boolean;
	requireScopes?: string[];
}
