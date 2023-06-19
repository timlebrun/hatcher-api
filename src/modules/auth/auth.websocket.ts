import { WsAdapter } from '@nestjs/platform-ws';
import { HatcherAuthGuard, IHatcherAuthGuardOptions } from './auth.guard';
import { INestApplicationContext } from '@nestjs/common';
import { HatcherAuthMiddleware } from './auth.middleware';
import { VerifyClientCallbackAsync } from 'ws';

export class HatcherAuthWebsocketAdapter extends WsAdapter {
    private static httpMiddleware: HatcherAuthMiddleware;

	constructor(private readonly app: INestApplicationContext) {
		super(app);

        HatcherAuthWebsocketAdapter.httpMiddleware = app.get(HatcherAuthMiddleware);
	}

	public static makeClientVerifier(options: IHatcherAuthGuardOptions): VerifyClientCallbackAsync {
		return (info, callback) => {
            console.log('VERIFYING CLIENT', info.req.headers);
            const guard = new HatcherAuthGuard(options);

            const maybeRequestTokenInfo = this.httpMiddleware.extractAndVerifyRequestAccessTokenInfo(info.req);
            info.req.token = maybeRequestTokenInfo;

            const canActivate = guard.checkRequestAllowed(info.req);

            console.log({ canActivate, maybeRequestTokenInfo });

			return callback(canActivate);
		};
	}
}
