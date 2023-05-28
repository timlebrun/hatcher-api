import { Module } from '@nestjs/common';
import { HatcherDatabaseService } from './database.service';
import { HatcherDatabaseEventService } from './services/event.service';

@Module({
    providers: [HatcherDatabaseService, HatcherDatabaseEventService],
    exports: [HatcherDatabaseService],
})
export class HatcherDatabaseModule {}
