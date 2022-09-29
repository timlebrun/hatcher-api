import { Module } from '@nestjs/common';
import { HatcherSoundController } from './sound.controller';
import { HatcherSoundGateway } from './sound.gateway';
import { HatcherSoundService } from './sound.service';

@Module({
	controllers: [HatcherSoundController],
	providers: [HatcherSoundService, HatcherSoundGateway],
	exports: [HatcherSoundService],
})
export class HatcherSoundModule {}
