import { Module } from '@nestjs/common';

import { HatcherTchatModule } from './modules/tchat';
import { HatcherSoundModule } from './modules/sound';
import { HatcherAuthModule } from './modules/auth';

import { HatcherRootController } from './controllers/root.controller';
import { HatcherPageController } from './controllers/page.controller';

@Module({
	imports: [HatcherAuthModule, HatcherTchatModule, HatcherSoundModule],
	controllers: [HatcherRootController, HatcherPageController],
	providers: [],
})
export class Hatcher {}
