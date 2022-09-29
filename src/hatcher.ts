import { Module } from '@nestjs/common';

import { HatcherTchatModule } from './modules/tchat';

import { HatcherRootController } from './controllers/root.controller';
import { HatcherPageController } from './controllers/page.controller';

@Module({
	imports: [HatcherTchatModule],
	controllers: [HatcherRootController, HatcherPageController],
	providers: [],
})
export class Hatcher {}
