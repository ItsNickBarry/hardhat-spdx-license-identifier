const fs = require('fs');
const { HardhatPluginError } = require('hardhat/plugins');

const {
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require('hardhat/builtin-tasks/task-names');

task('prepend-spdx-license', 'Prepends SPDX License identifier to local source files', async function (args, hre) {
  const config = hre.config.spdxLicenseIdentifier;

  const { license } = JSON.parse(fs.readFileSync(`${ hre.config.paths.root }/package.json`, 'utf8'));

  if (!license) {
    throw new HardhatPluginError('no license specified in package.json, unable to add SPDX License Identifier to sources');
  }

  const sourcePaths = await hre.run(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, args);

  const headerBase = '// SPDX-License-Identifier:';
  const regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  const header = `${ headerBase } ${ license }\n`;

  let count = 0;

  await Promise.all(sourcePaths.map(async (sourcePath) => {
    if (config.only.length && !config.only.some(m => sourcePath.match(m))) return;
    if (config.except.length && config.except.some(m => sourcePath.match(m))) return;

    // content is read from disk for preprocessor compatibility
    const content = fs.readFileSync(sourcePath).toString();

    const partialMatch = content.startsWith(headerBase);
    const exactMatch = content.startsWith(header);

    if (exactMatch) return;
    if (partialMatch && !hre.config.spdxLicenseIdentifier.overwrite) return;

    const padding = partialMatch ? '' : '\n';

    fs.writeFileSync(sourcePath, content.replace(regexp, header + padding));
    count++;
  }));

  if (count > 0) {
    console.log(`Prepended SPDX License Identifier "${ license }" to ${ count } sources.`);
  }
});
