import {
  filterSourcePaths,
  hasMatchingLicense,
  prependLicenseToFileContent,
  readLicenseFromPackageJson,
} from '../lib/license_identifier.js';
import { readUtf8File, writeUtf8File } from '@nomicfoundation/hardhat-utils/fs';
import type { SolidityHooks } from 'hardhat/types/hooks';

export default async (): Promise<Partial<SolidityHooks>> => ({
  build: async (context, rootFilePaths, options, next) => {
    const config = context.config.licenseIdentifier;

    if (config.runOnCompile) {
      const license =
        config.license ??
        (await readLicenseFromPackageJson(context.config.paths.root));
      const overwrite = config.overwrite;

      const sourcePaths = filterSourcePaths(config, rootFilePaths);

      await Promise.all(
        sourcePaths.map(async (sourcePath) => {
          const content = await readUtf8File(sourcePath);

          if (!hasMatchingLicense(content, license, overwrite)) {
            await writeUtf8File(
              sourcePath,
              prependLicenseToFileContent(content, license),
            );
          }
        }),
      );
    }

    return await next(context, rootFilePaths, options);
  },
});
