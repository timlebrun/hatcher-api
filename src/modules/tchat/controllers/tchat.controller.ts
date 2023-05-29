import { Body, Controller, Get, Post } from '@nestjs/common';
import { HatcherTchatService } from 'src/modules/tchat/tchat.service';

@Controller('api/tchat')
export class HatcherApiTchatController {
	constructor(private readonly tchat: HatcherTchatService) {}

	@Get('messages')
	listMessages() {
		return this.tchat.searchMessages();
	}

	@Post('messages')
	postMessage(@Body() payload: any) {
		return this.tchat.postMessage(payload);
	}
}
