const fs = require('fs');

const {
  TASK_COMPILE,
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
} = require('hardhat/builtin-tasks/task-names');

const CONFIG = {
  overwrite: false,
  runOnCompile: false,
};

const NAME = 'prepend-spdx-license';
const DESC = 'Prepends SPDX License identifier to local source files';

task(NAME, DESC, async function (args, hre) {
  let config = Object.assign({}, CONFIG, hre.config.spdxLicenseIdentifier);

  let { license } = JSON.parse(fs.readFileSync(`${ hre.config.paths.root }/package.json`, 'utf8'));

  if (!license) {
    throw ('No license specified in package.json, unable to add SPDX Liense Identifier to sources.');
  }

  let sources = await hre.run(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, args);

  let headerBase = '// SPDX-License-Identifier:';
  let regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  let header = `${ headerBase } ${ license }\n\n`;

  let count = 0;

  sources.forEach(function (absolutePath) {
    // content is read from disk for preprocessor compatibility
    let content = fs.readFileSync(absolutePath).toString();

    if (!content.startsWith(header) && (!content.startsWith(headerBase) || config.overwrite)) {
      fs.writeFileSync(absolutePath, content.replace(regexp, header));
      count++;
    }
  });

  console.log(`Prepended SPDX License Identifier "${ license }" to ${ count } sources.`);
});

task(TASK_COMPILE, async function (args, hre, runSuper) {
  let config = Object.assign({}, CONFIG, hre.config.spdxLicenseIdentifier);

  if (config.runOnCompile) {
    await hre.run(NAME);
  }

  await runSuper();
});
