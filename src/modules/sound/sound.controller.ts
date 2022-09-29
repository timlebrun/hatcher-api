import { Controller, Get, Post, Render } from '@nestjs/common';
import { HatcherSoundTrackModel } from './sound.models';
import { HatcherSoundService } from './sound.service';

@Controller('api/sound')
export class HatcherSoundController {
	constructor(private readonly service: HatcherSoundService) {}

	@Get('tracks')
	public async listTracks(): Promise<HatcherSoundTrackModel[]> {
		const tracks = await this.service.listTracks();

		return tracks;
	}

	@Post('tracks')
	public async uploadTrack() {
		return [];
	}

	@Get('files/:fileName')
	public async readFile() {
		return 'aaa';
	}
}
