import { Injectable } from '@nestjs/common';
import { IHatcherSoundTrack } from './sound.interfaces';

import { EventEmitter2 } from 'eventemitter2';
import * as uuid from 'uuid';
import { join } from 'path';

const { HATCHER_SOUND_PUBLIC_URL = '/api/sound/files/' } = process.env;

@Injectable()
export class HatcherSoundService extends EventEmitter2 {
	private readonly tracks: IHatcherSoundTrack[] = [
		{
			id: uuid.v1(),

			displayLabel: 'Musique',
			displayColor: '#010199',
			displayIcon: '🪓',

			playbackDuration: 180000,
			playbackStartTime: null,
			playbackTriggeredAt: null,

			songTitle: 'TVORCHI',
			songArtist: 'Мова Тiла',

			filePath: '1381ff30-403e-11ed-a93a-079028c5a20b.mp3',
			fileSize: 12,
			fileOriginalName: 'hehe.mp3',
			fileOrginalType: 'sound/mp3',
			fileUrl: HatcherSoundService.resolvePublicFileUrl('hehe.mp3'),

			tags: ['russent'],
			data: {},

			updatedAt: new Date(),
			createdAt: new Date(),
		},
		{
			id: uuid.v1(),

			displayLabel: 'Sound',
			displayColor: '#ffaaee',
			displayIcon: '✨',

			playbackDuration: 1500,
			playbackStartTime: null,
			playbackTriggeredAt: null,

			songTitle: null,
			songArtist: null,

			filePath: '1381ff30-403e-11ed-a93a-079028c5a20b.mp3',
			fileSize: 12,
			fileOriginalName: 'hoho.mp3',
			fileOrginalType: 'sound/mp3',
			fileUrl: HatcherSoundService.resolvePublicFileUrl('hehe.mp3'),

			tags: ['russent'],
			data: {},

			updatedAt: new Date(),
			createdAt: new Date(),
		},
	];

	constructor() {
		super({ wildcard: true });
	}

	public async listTracks(): Promise<IHatcherSoundTrack[]> {
		return this.tracks;
	}

	public async getTrack(trackId: string): Promise<IHatcherSoundTrack | null> {
		return this.tracks.find(t => t.id == trackId);
	}

	public async scrollTrack(
		trackId: string,
		playbackStartTime: number,
	): Promise<boolean | null> {
		const track = this.tracks.find(t => t.id == trackId);
		const updatedTrack = await this.updateTrack(trackId, {
			playbackTriggeredAt: track.playbackTriggeredAt ? new Date : null, // Resets trigger time
			playbackStartTime,
		});

		this.emit('track:scroll', trackId, playbackStartTime);

		return updatedTrack;
	}

	public async resetTrackPlayback(trackId: string): Promise<boolean | null> {
		const track = await this.updateTrack(trackId, {
			playbackTriggeredAt: null,
			playbackStartTime: null,
		});

		this.emit('track:reset', track);

		return track;
	}

	public async stopTrackPlayback(trackId: string): Promise<boolean | null> {
		const track = this.tracks.find(t => t.id == trackId);

		const trackPlaybackElapsedTime = Date.now() - track.playbackTriggeredAt.getTime();
		const trackPlaybackStartTime = trackPlaybackElapsedTime + track.playbackStartTime;

		const updatedTrack = await this.updateTrack(trackId, {
			playbackStartTime: trackPlaybackStartTime, // set playback start head at last position
			playbackTriggeredAt: null, // stop playing
		});

		this.emit('track:stop', track);

		return updatedTrack;
	}

	public async triggerTrackPlayback(trackId: string): Promise<boolean | null> {
		const track = await this.updateTrack(trackId, {
			playbackTriggeredAt: new Date(),
		});

		this.emit('track:play', { target: trackId });

		return track;
	}

	public async updateTrack(trackId: string, data: Partial<IHatcherSoundTrack> = {}) {
		const track = this.tracks.find(t => t.id == trackId);
		if (!track) return null;

		Object.assign(track, data);

		console.log('uhm');

		this.emit('track:updated', {
			target: trackId,
			payload: data,
		});

		return;
	}

	public async readFile(): Promise<Buffer> {
		return Buffer.from([]);
	}

	public static resolvePublicFileUrl(path: string) {
		return join(HATCHER_SOUND_PUBLIC_URL, path);
	}
}
