import { NestFactory } from '@nestjs/core';

import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';

import { Edge, EdgeOptions } from 'edge.js';
import { join } from 'path';

import { Hatcher } from './hatcher';

(async function() {
	const app = await NestFactory.create<NestExpressApplication>(Hatcher);
	app.useWebSocketAdapter(new WsAdapter(app));

	app.engine('edge', edgeEngine());

	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));
	app.setViewEngine('edge');

	await app.listen(3000);
})();

function edgeEngine(options: EdgeOptions = {}) {
	const edge = new Edge(options);

	return function (filePath: string, data: any, next) {
		edge.mount(data.settings.views); // TODO: find a way to do only on startup

		edge
			.render(filePath, data)
			.then(html => next(null, html))
			.catch(error => next(error, null));
	};
}
