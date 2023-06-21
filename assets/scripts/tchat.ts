import ReconnectingWebSocket from 'reconnecting-websocket';
import { HatcherAuthClient } from './auth';

export const HATCHER_TCHAT_PAGE_THREAD_TTL = 120_000; // number of milliseconds before a new message from the same source becomes another thread

type IHatcherTchatMessageListener = (message: IHatcherPageTchatMessage) => void;

interface IHatcherPageTchatThread {
	messages: IHatcherPageTchatMessage[];
	date: Date;
}

interface IHatcherPageTchatMessage {
	id: number;

	type: string;
	content: Record<string, any>;

	createdAt: Date;
}

interface IHatcherPageTchatChannel {
	slug: string;

    label: string;

    // config

    // updatedAt
    // createdAt

	createdAt: Date;
}

export class HatcherTchatClient {
    private static auth: HatcherAuthClient;

	private messageListeners: IHatcherTchatMessageListener[] = [];

    private webSocket: ReconnectingWebSocket;

	constructor(private readonly webSocketUrl: string) {}

    /**
     * Instanciates connection tot the websocket server
     */
    public async connect() {
        const accessToken = await HatcherTchatClient.auth.resolveAccessToken();
        const wsProtocol = encodeURIComponent(`hatcher<${accessToken}>`);

        this.webSocket = new ReconnectingWebSocket(this.webSocketUrl, wsProtocol);

        this.webSocket.addEventListener('message', m => this.handleWebSocketMessage(m));
    }

	private handleWebSocketMessage(webSocketMessage: MessageEvent) {
		const websocketMessageData = JSON.parse(webSocketMessage.data);

		if (websocketMessageData.event === 'tchat::message:created')
			return this.handleWebsocketTchatMessagePayload(websocketMessageData.data);
	}

	private handleWebsocketTchatMessagePayload(payload: any) {
		const message = HatcherTchatClient.convertPayloadToMessage(payload);
		for (const listener of this.messageListeners) listener(message);
	}

	public sendCommand(command: string) {
		const webSocketPayload = HatcherTchatClient.makeWebsocketPayload('tchat::command', command);

		this.webSocket.send(webSocketPayload);
	}

    public async fetchChannel(channelSlug: string): Promise<IHatcherPageTchatMessage> {
		const channelResponse = await fetch(`/api/tchat/channels/${channelSlug}`);
		const channelResponseData = await channelResponse.json();

		return null as any;
    }

	public async fetchMessages(): Promise<IHatcherPageTchatMessage[]> {
		const messageResponse = await fetch('/api/tchat/messages');
		const messageResponseData = await messageResponse.json();

		return messageResponseData.map(HatcherTchatClient.convertPayloadToMessage);
	}

	public onMessage(listener: IHatcherTchatMessageListener) {
		return this.messageListeners.push(listener);
	}

	private static makeWebsocketPayload(event: string, data: any = undefined) {
		const payload = { event, data };
		const payloadString = JSON.stringify(payload);

		return payloadString;
	}

    private static convertPayloadToChannel(payload: any): IHatcherPageTchatChannel {
		return {
			id: payload.id,

			type: payload.type,
			content: payload.content,

			createdAt: new Date(payload.createdAt),
		};
	}

	private static convertPayloadToMessage(payload: any): IHatcherPageTchatMessage {
		return {
			id: payload.id,

			type: payload.type,
			content: payload.content,

			createdAt: new Date(payload.createdAt),
		};
	}

    public static registerAuth(auth: HatcherAuthClient) {
        this.auth = auth;
    }
}

/**
 * Takes an array of messages and turns it into an array of threads
 *
 * - date
 * - messages
 */
export function aggregateMessagesToThreads(
	messages: IHatcherPageTchatMessage[],
): IHatcherPageTchatThread[] {
	const threads: IHatcherPageTchatThread[] = [];

	for (const message of messages) {
		let lastThread = threads.length ? threads[threads.length - 1] : null;

		if (!lastThread) {
			lastThread = { messages: [], date: message.createdAt };
			threads.push(lastThread);
		}

		const lastThreadTime = lastThread.date.getTime();
		const messageCreationTime = message.createdAt.getTime();

		// If last thread is dead, make another one
		if (lastThreadTime + HATCHER_TCHAT_PAGE_THREAD_TTL < messageCreationTime) {
			lastThread = { messages: [], date: message.createdAt };
			threads.push(lastThread);
		}

		lastThread.messages.push(message);
		lastThread.date = message.createdAt;
	}

	return threads;
}

Object.assign(window, {
	ReconnectingWebSocket,
	HatcherTchatClient,
	aggregateMessagesToThreads,
});
