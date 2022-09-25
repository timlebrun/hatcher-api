import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { Hatcher } from './hatcher';

(async function() {
	const app = await NestFactory.create(Hatcher);
	app.useWebSocketAdapter(new WsAdapter(app));

	await app.listen(3000);
})();
