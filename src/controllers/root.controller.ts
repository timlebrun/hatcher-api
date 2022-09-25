import { Controller, Get } from '@nestjs/common';

@Controller()
export class HatcherRootController {
	@Get()
	index() {
		return '';
	}
}
