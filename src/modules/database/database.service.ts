import { BeforeApplicationShutdown, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import createPostgresSubscriber from 'pg-listen';

const { DATABASE_URL } = process.env;

@Injectable()
export class HatcherDatabaseService extends PrismaClient
	implements OnModuleInit, BeforeApplicationShutdown {

	public readonly subscriber = createPostgresSubscriber({
		connectionString: DATABASE_URL,
	});

	/**
	 * Connects the Client to the database on startup
	 */
	public async onModuleInit() {
		await this.$connect();
		await this.subscriber.connect();
	}

	/**
	 * Attempts to disconnect on shutdown
	 */
	public async beforeApplicationShutdown() {
		await this.$disconnect();
		await this.subscriber.close();
	}
}
