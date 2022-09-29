import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HatcherRootController {
	@Get()
	@Render('pages/home')
	index() {
		return {};
	}
}
