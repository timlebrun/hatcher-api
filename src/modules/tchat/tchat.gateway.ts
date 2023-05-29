import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import * as uuid from 'uuid';
import { HatcherTchatService } from './tchat.service';

@WebSocketGateway({ path: '/api/tchat' })
export class HatcherTchatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(this.constructor.name);

	private readonly clients: Record<string, IHatcherSoundGatewayWebSocket> = {};

	constructor(private readonly service: HatcherTchatService) {
		this.service.onMessage(message => this.broadcast('tchat::message:created', message))
	}

	public broadcast(event: string, data: any) {
		const broadcastPayload = this.makeMessagePayload(event, data);

		for (const client of Object.values(this.clients)) client.send(broadcastPayload);
	}

	private makeMessagePayload(event: string, data: any = undefined): string {
		const payload = {
			event,
			clock: Date.now(),
			data,
		};

		return JSON.stringify(payload);
	}

	@SubscribeMessage('tchat::command')
	handleCommandEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		const parsedCommand = HatcherTchatService.parseCommand(data);

		if (parsedCommand) this.service.postMessage(parsedCommand);
	}

	handleConnection(client: IHatcherSoundGatewayWebSocket, request: IncomingMessage) {
		client._id = uuid.v1(); // Generates a unique client ID on connection for tracking
		this.clients[client._id] = client;
		this.logger.verbose(`Client ${client._id} connected !`);
	}

	handleDisconnect(client: any) {
		delete this.clients[client._id];
		this.logger.verbose(`Client ${client._id} disconnected...`);
	}
}

type IHatcherSoundGatewayWebSocket = WebSocket & { _id: string };
