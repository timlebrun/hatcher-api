import { BeforeApplicationShutdown, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { HatcherDatabaseEventService } from './services/event.service';

@Injectable()
export class HatcherDatabaseService extends PrismaClient
	implements OnModuleInit, BeforeApplicationShutdown {

	constructor(
        public readonly events: HatcherDatabaseEventService,
    ) {
		super();
	}

	/**
	 * Connects the Client to the database on startup
	 */
	public async onModuleInit() {
		await this.$connect();
	}

	/**
	 * Attempts to disconnect on shutdown
	 */
	public async beforeApplicationShutdown() {
		await this.$disconnect();
	}
}
