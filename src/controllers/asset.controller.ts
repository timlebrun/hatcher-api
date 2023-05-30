import {
	Controller,
	Get,
	Logger,
	NotFoundException,
	OnModuleInit,
	Param,
} from '@nestjs/common';

import { existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import * as esbuild from 'esbuild';

import { assetPath, tempPath } from 'src/paths';
import { rimrafSync } from 'rimraf';
import { globSync } from 'glob';

const tempAssetPath = `${tempPath}/assets`;
rimrafSync(tempAssetPath);
mkdirSync(tempAssetPath, { recursive: true });

@Controller('assets')
export class HatcherAssetController implements OnModuleInit {
	private readonly logger = new Logger(this.constructor.name);

	@Get(':fileName(*)')
	public getScriptAsset(@Param('fileName') fileName: string) {
		const maybeFilePath = `${tempAssetPath}/${fileName}`;
		const fileExists = existsSync(maybeFilePath);
		if (!fileExists) throw new NotFoundException();

		return readFileSync(maybeFilePath, 'utf8');
	}

	public async onModuleInit() {
		const assetFilePaths = globSync(`${assetPath}/**/*.ts`);

		await esbuild.build({
			entryPoints: assetFilePaths,
			outdir: tempAssetPath,
			bundle: true,
		});

		this.logger.log(`Loaded ${assetFilePaths.length} asset scripts !`);
	}
}
