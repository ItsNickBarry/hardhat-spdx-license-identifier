const fs = require('fs');
const { HardhatPluginError } = require('hardhat/plugins');

const {
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require('hardhat/builtin-tasks/task-names');

task('prepend-spdx-license', 'Prepends SPDX License identifier to local source files', async function (args, hre) {
  const { license } = JSON.parse(fs.readFileSync(`${ hre.config.paths.root }/package.json`, 'utf8'));

  if (!license) {
    throw new HardhatPluginError('no license specified in package.json, unable to add SPDX License Identifier to sources');
  }

  const sourcePaths = await hre.run(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, args);

  const headerBase = '// SPDX-License-Identifier:';
  const regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  const header = `${ headerBase } ${ license }\n\n`;

  let count = 0;

  await Promise.all(sourcePaths.map(async (sourcePath) => {
    // content is read from disk for preprocessor compatibility
    const content = fs.readFileSync(sourcePath).toString();

    if (!content.startsWith(header) && (!content.startsWith(headerBase) || hre.config.spdxLicenseIdentifier.overwrite)) {
      fs.writeFileSync(sourcePath, content.replace(regexp, header));
      count++;
    }
  }));

  if (count > 0) {
    console.log(`Prepended SPDX License Identifier "${ license }" to ${ count } sources.`);
  }
});
