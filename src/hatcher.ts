import { Module } from '@nestjs/common';

import { HatcherTchatModule } from './modules/tchat';

import { HatcherRootController } from './controllers/root.controller';

@Module({
	imports: [HatcherTchatModule],
	controllers: [HatcherRootController],
	providers: [],
})
export class Hatcher {}
