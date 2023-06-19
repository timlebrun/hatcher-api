import { NestFactory } from '@nestjs/core';

import { NestExpressApplication } from '@nestjs/platform-express';

import { Edge, EdgeOptions } from 'edge.js';
import { join } from 'path';

import { HatcherAuthWebsocketAdapter } from './modules/auth';
import { Hatcher } from './hatcher';

(async function() {
	const app = await NestFactory.create<NestExpressApplication>(Hatcher);

	app.useWebSocketAdapter(new HatcherAuthWebsocketAdapter(app));

	app.useStaticAssets(join(__dirname, '..', 'public'));
	app.setBaseViewsDir(join(__dirname, '..', 'views'));

	const edge = new Edge({});
	app.engine('edge', makeEdgeEngineAdapter({ edge }));
	app.setViewEngine('edge');

	await app.listen(8000);
})();

function makeEdgeEngineAdapter(options: EdgeOptions & { edge?: Edge }) {
	const edge = options.edge || new Edge(options);

	return function(filePath: string, data: any, next) {
		if (data.settings?.views) edge.mount('default', data.settings?.views); // NOTE: required to use express configuration

		edge
			.render(filePath, data)
			.then(html => next(null, html))
			.catch(error => next(error, null));
	};
}
