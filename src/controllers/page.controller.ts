import { Controller, Get, Render } from '@nestjs/common';

@Controller('pages')
export class HatcherPageController {
	@Get('sound')
	@Render('pages/sound')
	index() {
		return {};
	}
}
