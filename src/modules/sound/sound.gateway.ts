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
import { IHatcherSoundTrack } from './sound.interfaces';
import { HatcherSoundService } from './sound.service';

@WebSocketGateway({ path: '/api/sound' })
export class HatcherSoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(this.constructor.name);

	private readonly clients: Record<string, IHatcherSoundGatewayWebSocket> = {};

	constructor(private readonly service: HatcherSoundService) {
		const self = this;

		this.service.on('*', function(data: any) {
			const event = this.event;
			console.log({ event, data });
			self.broadcast(`sound::${event}`, data);
		});
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

	@SubscribeMessage('sound::track:play')
	async handleTrackPlayEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		if (!data.target)
			return this.logger.warn(
				`Received invalid 'target' value for 'sound::track:play' event. Ignoring.`,
			);

		this.logger.verbose(
			`Received 'sound::track:play' for track #${data.target} command from client ${client._id}. Proceeding...`,
		);

		await this.service.triggerTrackPlayback(data.target);
	}

	@SubscribeMessage('sound::track:scroll')
	async handleTrackScrollEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		if (!data.target)
			return this.logger.warn(
				`Received invalid 'target' value for 'sound::track:scroll' event. Ignoring.`,
			);

		this.logger.verbose(
			`Received 'sound::track:scroll' for track #${data.target} command from client ${client._id}. Proceeding...`,
		);

		const track = await this.service.getTrack(data.target);
		const trackPlaybackStartTime = track.playbackDuration * data.payload.ratio;

		await this.service.scrollTrack(track.id, trackPlaybackStartTime);
	}

	@SubscribeMessage('sound::track:reset')
	async handleTrackPauseEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		if (!data.target)
			return this.logger.warn(
				`Received invalid 'target' value for 'sound::track:play' event. Ignoring.`,
			);

		this.logger.verbose(
			`Received 'sound::track:reset' for track #${data.target} command from client ${client._id}. Proceeding...`,
		);

		await this.service.resetTrackPlayback(data.target);
	}

	@SubscribeMessage('sound::track:stop')
	async handleTrackStopEvent(
		@MessageBody() data: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		if (!data.target)
			return this.logger.warn(
				`Received invalid 'target' value for 'sound::track:stop' event. Ignoring.`,
			);

		this.logger.verbose(
			`Received 'sound::track:stop' for track #${data.target} command from client ${client._id}. Proceeding...`,
		);

		await this.service.stopTrackPlayback(data.target);
	}

	@SubscribeMessage('sound::track:update')
	async handleTrackUpdateEvent(
		@MessageBody() payload: any,
		@ConnectedSocket() client: IHatcherSoundGatewayWebSocket,
	) {
		if (!payload.target)
			return this.logger.warn(
				`Received invalid 'target' value for 'sound::track:update' event. Ignoring.`,
			);

		this.logger.verbose(
			`Received 'sound::track:update' for track #${payload.target} command from client ${client._id}. Proceeding...`,
		);

		await this.service.updateTrack(payload.target, payload.data);
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
