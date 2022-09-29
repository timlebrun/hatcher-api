import { Logger } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import * as uuid from 'uuid';

@WebSocketGateway({ path: '/sound' })
export class HatcherSoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(this.constructor.name);

	@SubscribeMessage('sound::play')
	handlePlayEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	): string {
		this.logger.verbose(
			`Received 'sound::play' for track #${data.trackId} command from client ${client._id}. Proceeding...`,
		);

		return data;
	}

	handleConnection(client: IHatcherSoundGatewayWebSocket, request: IncomingMessage) {
		client._id = uuid.v1(); // Generates a unique client ID on connection for tracking
		this.logger.verbose(`Client ${client._id} connected !`);
	}

	handleDisconnect(client: any) {
		this.logger.verbose(`Client ${client._id} disconnected...`);
	}
}

type IHatcherSoundGatewayWebSocket = WebSocket & { _id: string };
