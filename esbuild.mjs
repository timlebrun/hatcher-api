import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

import { rimraf } from 'rimraf';
import { glob } from 'glob';

const [nodePath, scriptPath, action] = process.argv;

if (!action) {
	console.log('action is required');
	process.exit(1);
}

// TODO: rimraf assets content before building
// TODO: add more console feedback

await rimraf('./assets/*');
const assetFilePaths = await glob('./assets/**/*.*');

const esbuildContext = await esbuild.context({
	entryPoints: assetFilePaths,
	target: ['chrome58', 'edge18', 'firefox57', 'safari11'],
	bundle: true,
	outdir: './public/assets',
	plugins: [sassPlugin()],
});

if (action === 'build') {
	const build = await esbuildContext.rebuild();
	console.debug(build);
	process.exit(0);
}

if (action === 'watch') {
	await esbuildContext.watch();
	console.debug('watching');
}
