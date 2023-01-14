import { Controller, Delete, Get, Patch, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor as fileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { readdirSync } from 'fs';
import { HatcherSoundGateway } from './sound.gateway';
import { HatcherSoundTrackModel } from './sound.models';
import { HatcherSoundService } from './sound.service';

@Controller('api/sound')
export class HatcherSoundController {
	constructor(
		private readonly service: HatcherSoundService,
		private readonly gateway: HatcherSoundGateway,
	) {}

	@Get('tracks')
	@ApiOkResponse({ type: HatcherSoundTrackModel, isArray: true })
	public async listTracks(): Promise<HatcherSoundTrackModel[]> {
		const tracks = await this.service.listTracks();

		return tracks;
	}

	@Post('tracks')
	@UseInterceptors(fileInterceptor('file'))
	@ApiCreatedResponse({ type: HatcherSoundTrackModel })
	public async addTrack(@UploadedFile() file: Express.Multer.File) {
		return [];
	}

	@Patch('tracks/:trackId')
	@ApiBody({ type: HatcherSoundTrackModel })
	@ApiOkResponse({ type: HatcherSoundTrackModel, isArray: true })
	public async editTrack(@UploadedFile() file: Express.Multer.File) {
		return [];
	}

	@Delete('tracks/:trackId')
	@ApiBody({ type: HatcherSoundTrackModel })
	@ApiOkResponse({ type: HatcherSoundTrackModel, isArray: true })
	public async removeTrack(@UploadedFile() file: Express.Multer.File) {
		return [];
	}

	@Get('files/:fileName')
	public async listFiles() {
		const files = readdirSync('');
		return 'aaa';
	}

	@Get('files/:fileName')
	public async readFile() {
		return 'aaa';
	}
}
