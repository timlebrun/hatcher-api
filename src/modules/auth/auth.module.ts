import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OnGatewayInit } from '@nestjs/websockets';

import { HatcherAuthService } from './auth.service';
import { HatcherAuthController } from './auth.controller';
import { HatcherDatabaseModule } from '../database';
import { HatcherAuthMiddleware } from './auth.middleware';
import { WebSocketServer } from 'ws';

@Module({
	imports: [HatcherDatabaseModule],
	providers: [HatcherAuthService, HatcherAuthMiddleware],
	controllers: [HatcherAuthController],
})
export class HatcherAuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		return consumer.apply(HatcherAuthMiddleware).forRoutes('*');
	}
}
