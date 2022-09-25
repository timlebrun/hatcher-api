import * as uuid from 'uuid';
import { IHatcherTchatMessage } from './tchat.interface';

export class HatcherTchatService {
	private readonly messages: IHatcherTchatMessage[] = [];
	private readonly messageListeners: IHatcherChatServiceMessageListener[] = [];

	public listMessages() {
		return this.messages;
	}

	public postMessage(payload: IHatcherChatServiceMessagePayload) {
		const message: IHatcherTchatMessage = {
			id: uuid.v1(),
			...payload,
			createdAt: new Date(),
		};

		this.messages.push(message);
		for (const listener of this.messageListeners) listener(message);

		return message;
	}

	public onMessage(listener: IHatcherChatServiceMessageListener) {
		this.messageListeners.push(listener);
	}
}

type IHatcherChatServiceMessagePayload = Omit<IHatcherTchatMessage, 'id' | 'createdAt'>;
type IHatcherChatServiceMessageListener = (message: IHatcherTchatMessage) => any;
