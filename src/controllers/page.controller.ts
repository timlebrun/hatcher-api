import { Controller, Get, Render } from '@nestjs/common';
import { HatcherSoundService } from 'src/modules/sound/sound.service';

@Controller('pages')
export class HatcherPageController {
	constructor(private readonly sound: HatcherSoundService) {}

	@Get('sound/admin')
	@Render('pages/sound/admin')
	public async getSoundAdminPage() {
		return {};
	}

	@Get('sound/listener')
	@Render('pages/sound/listener')
	public async getSoundListenerPage() {
		return {};
	}
}
