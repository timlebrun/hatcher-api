import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { glob } from 'glob';

const [nodePath, scriptPath, action] = process.argv;

if (!action) {
	console.log('action is required');
	process.exit(1);
}

const assetFilePaths = await glob('./assets/**/*.*');
console.debug(assetFilePaths);

const esbuildContext = await esbuild.context({
	entryPoints: assetFilePaths,
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