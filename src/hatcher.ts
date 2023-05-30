import { Module } from '@nestjs/common';

import { HatcherTchatModule } from './modules/tchat';

import { HatcherRootController } from './controllers/root.controller';
import { HatcherAssetController } from './controllers/asset.controller';
import { HatcherPageController } from './controllers/page.controller';
import { HatcherSoundModule } from './modules/sound/sound.module';

@Module({
	imports: [HatcherTchatModule, HatcherSoundModule],
	controllers: [HatcherRootController, HatcherAssetController, HatcherPageController],
	providers: [],
})
export class Hatcher {}
