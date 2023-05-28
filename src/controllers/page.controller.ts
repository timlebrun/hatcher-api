import { Controller, Get, Render } from '@nestjs/common';
import { HatcherSoundService } from 'src/modules/sound/sound.service';

/**
 * This controller centralizes all pages exposed by the API
 * 
 * The page definition is separate from the corresponding modules
 * because the goal of this API is to provide a server, pages are
 * mainly for testing purposes
 */
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

	@Get('tchat/channel')
	@Render('pages/tchat/channel')
	public async getTchatChannelPage() {
		return {};
	}
}
