import { Controller, Get, Render } from '@nestjs/common';
import { HatcherSoundService } from 'src/modules/sound/sound.service';

@Controller('pages')
export class HatcherPageController {
	constructor(private readonly sound: HatcherSoundService) {}

	@Get('sound')
	@Render('pages/sound')
	public async index() {
		const tracks = await this.sound.listTracks();

		return { tracks };
	}
}
