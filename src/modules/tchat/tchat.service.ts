import { IHatcherTchatMessage, IHatcherTchatMessageType } from './tchat.interface';
import { HatcherDatabaseService, Prisma } from '../database';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class HatcherTchatService implements OnModuleInit {
	private readonly messageListeners: IHatcherChatServiceMessageListener[] = [];

	constructor(private readonly database: HatcherDatabaseService) {
		this.database.subscriber.notifications.on('tchat/messages', m => this.handleDatabaseMessageEvent(m));
	}

	async onModuleInit() {
		await this.database.subscriber.listenTo('tchat/messages');
	}

	/**
	 * Handles incoming notification from the database
	 *
	 * should contain JSON-encoded message payload
	 *
	 * @param message
	 */
	private handleDatabaseMessageEvent(message: unknown) {
		const messageData = JSON.parse(message as any);

		for (const listener of this.messageListeners) listener(messageData as IHatcherTchatMessage);
	}

	private async dispatchDatabaseMessageEvent(message: IHatcherTchatMessage) {
		await this.database.subscriber.notify('tchat/messages', JSON.stringify(message));
	}

	/**
	 * Searches through all messages
	 *
	 * @param where
	 * @returns
	 */
	public searchMessages(where: Prisma.HatcherTchatChannelWhereInput = {}) {
		return this.database.hatcherTchatMessage.findMany({ where });
	}

	/**
	 * Stores and dispatches a message
	 *
	 * @param payload
	 * @returns
	 */
	public async postMessage(payload: IHatcherChatServiceMessagePayload) {
		const databaseMessage = await this.database.hatcherTchatMessage.create({
			data: payload,
		});

		this.dispatchDatabaseMessageEvent(databaseMessage as IHatcherTchatMessage);

		return databaseMessage;
	}

	public onMessage(listener: IHatcherChatServiceMessageListener) {
		this.messageListeners.push(listener);
	}

	/**
	 * Parses a string from the client and returns a parsed payload
	 *
	 * @param command The input string command
	 * @returns The parsed and interpreted command
	 */
	public static parseCommand(command: string): IHatcherChatServiceMessagePayload | null {
		return {
			type: IHatcherTchatMessageType.text,
			content: { text: command },
			// author: null,
			// recipient: '*',
		};

		return null;
	}
}

type IHatcherChatServiceMessagePayload = Omit<IHatcherTchatMessage, 'id' | 'createdAt'>;
type IHatcherChatServiceMessageListener = (message: IHatcherTchatMessage) => any;
