const fs = require('fs');
const { extendConfig } = require('hardhat/config');

const { HardhatPluginError } = require('hardhat/plugins');

const {
  TASK_COMPILE,
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require('hardhat/builtin-tasks/task-names');

extendConfig(function (config, userConfig) {
  config.spdxLicenseIdentifier = Object.assign(
    {
      overwrite: false,
      runOnCompile: false,
    },
    userConfig.spdxLicenseIdentifier
  );
});

const NAME = 'prepend-spdx-license';
const DESC = 'Prepends SPDX License identifier to local source files';

task(NAME, DESC, async function (args, hre) {
  let { license } = JSON.parse(fs.readFileSync(`${ hre.config.paths.root }/package.json`, 'utf8'));

  if (!license) {
    throw new HardhatPluginError('no license specified in package.json, unable to add SPDX Liense Identifier to sources');
  }

  let sources = await hre.run(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, args);

  let headerBase = '// SPDX-License-Identifier:';
  let regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  let header = `${ headerBase } ${ license }\n\n`;

  let count = 0;

  sources.forEach(function (absolutePath) {
    // content is read from disk for preprocessor compatibility
    let content = fs.readFileSync(absolutePath).toString();

    if (!content.startsWith(header) && (!content.startsWith(headerBase) || hre.config.spdxLicenseIdentifier.overwrite)) {
      fs.writeFileSync(absolutePath, content.replace(regexp, header));
      count++;
    }
  });

  if (count > 0) {
    console.log(`Prepended SPDX License Identifier "${ license }" to ${ count } sources.`);
  }
});

task(TASK_COMPILE, async function (args, hre, runSuper) {
  if (hre.config.spdxLicenseIdentifier.runOnCompile) {
    await hre.run(NAME);
  }

  await runSuper();
});
