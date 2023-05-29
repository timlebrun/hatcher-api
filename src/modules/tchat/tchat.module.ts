import { Module } from '@nestjs/common';
import { HatcherTchatService } from './tchat.service';
import { HatcherTchatGateway } from './tchat.gateway';
import { HatcherDatabaseModule } from '../database/database.module';
import { HatcherApiTchatController } from './controllers/tchat.controller';

@Module({
	imports: [HatcherDatabaseModule],
	providers: [HatcherTchatService, HatcherTchatGateway],
	controllers: [HatcherApiTchatController],
	exports: [HatcherTchatService],
})
export class HatcherTchatModule {}
