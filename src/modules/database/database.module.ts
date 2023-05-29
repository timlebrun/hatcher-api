import { Module } from '@nestjs/common';
import { HatcherDatabaseService } from './database.service';

@Module({
	providers: [HatcherDatabaseService],
	exports: [HatcherDatabaseService],
})
export class HatcherDatabaseModule {}
