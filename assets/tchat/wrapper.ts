import { IHatcherPageTchatMessage } from './interfaces';

export class HatcherTchatSocketWrapper {
	private messageListeners: IHatcherTchatMessageListener[] = [];

	constructor(private readonly webSocket: WebSocket) {
		this.webSocket.addEventListener('message', m => this.handleWebSocketMessage(m));
	}

	private handleWebSocketMessage(webSocketMessage: MessageEvent) {
		const websocketMessageData = JSON.parse(webSocketMessage.data);

		if (websocketMessageData.event === 'tchat::message:created')
			return this.handleWebsocketTchatMessagePayload(websocketMessageData.data);
	}

	private handleWebsocketTchatMessagePayload(payload: any) {
		const message = HatcherTchatSocketWrapper.convertPayloadToMessage(payload);
		for (const listener of this.messageListeners) listener(message);
	}

	public sendCommand(command: string) {
		const webSocketPayload = HatcherTchatSocketWrapper.makeWebsocketPayload(
			'tchat::command',
			command,
		);

		this.webSocket.send(webSocketPayload);
	}

	public onMessage(listener: IHatcherTchatMessageListener) {
		this.messageListeners.push(listener);

		return;
	}

	private static makeWebsocketPayload(event: string, data: any = undefined) {
		const payload = { event, data };
		const payloadString = JSON.stringify(payload);

		return payloadString;
	}

	private static convertPayloadToMessage(payload: any): IHatcherPageTchatMessage {
		return {
			id: payload.id,

			type: payload.type,
			content: payload.content,

			createdAt: new Date(payload.createdAt),
		};
	}
}

type IHatcherTchatMessageListener = (message: IHatcherPageMessage) => void;
