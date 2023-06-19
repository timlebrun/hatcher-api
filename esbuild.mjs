import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

import { rimraf } from 'rimraf';
import { glob } from 'glob';
import { dirname, resolve } from 'path';

const [nodePath, scriptPath, action] = process.argv;

const projectPath = dirname(scriptPath);

const assetPath = resolve(projectPath, 'assets');
const publicPath = resolve(projectPath, 'public');

if (!action) {
	console.log('action is required');
	process.exit(1);
}

// TODO: add more console feedback

// Deletes everything in asset dir
await rimraf(`${publicPath}/assets/**/*`, { glob: true });

// Get all files that should be bundled
const assetFilePaths = await glob(`${assetPath}/**/*.*`);

const esbuildContext = await esbuild.context({
	plugins: [sassPlugin()],
	entryPoints: assetFilePaths,
	target: ['chrome58', 'edge18', 'firefox57', 'safari11'],
	outdir: './public/assets',
	bundle: true,
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
