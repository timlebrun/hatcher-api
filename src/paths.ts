import { resolve } from 'path';
import { tmpdir } from 'os';

export const srcPath = __dirname;
export const basePath = resolve(srcPath, '..');
export const assetPath = resolve(basePath, 'assets');
export const cachePath = resolve(basePath, 'cache');
export const tempPath = `${tmpdir()}/.hatcher`
