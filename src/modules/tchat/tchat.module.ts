import { Module } from '@nestjs/common';
import { HatcherTchatService } from './tchat.service';

@Module({
	providers: [HatcherTchatService],
	exports: [HatcherTchatService],
})
export class HatcherTchatModule {}
