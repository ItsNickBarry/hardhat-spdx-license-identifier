const {
  TASK_COMPILE,
  TASK_COMPILE_GET_RESOLVED_SOURCES,
} = require('@nomiclabs/buidler/builtin-tasks/task-names');

const fs = require('fs');

const CONFIG = {
  overwrite: false,
  runOnCompile: false,
};

const NAME = 'prepend-spdx-license';
const DESC = 'Prepends SPDX License identifier to local source files';

task(NAME, DESC, async function (args, bre) {
  let config = Object.assign({}, CONFIG, bre.config.spdxLicenseIdentifier);

  let packageJson = JSON.parse(fs.readFileSync(`${ bre.config.paths.root }/package.json`, 'utf8'));
  let spdx;

  if (packageJson.license) {
    spdx = packageJson.license;
  } else {
    console.log('No license specified in package.json');
    spdx = 'UNLICENSED';
  }

  let sources = await bre.run(TASK_COMPILE_GET_RESOLVED_SOURCES, args);

  let headerBase = '// SPDX-License-Identifier:';
  let regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  let header = `${ headerBase } ${ spdx }\n\n`;

  let count = 0;

  sources.forEach(function ({ absolutePath, content }) {
    if (!content.startsWith(header) && (!content.startsWith(headerBase) || config.overwrite)) {
      fs.writeFileSync(absolutePath, content.replace(regexp, header));
      count++;
    }
  });

  console.log(`Prepending SPDX License Identifier to ${ count } sources: ${ spdx }`);
});

task(TASK_COMPILE, async function (args, bre, runSuper) {
  let config = Object.assign({}, CONFIG, bre.config.spdxLicenseIdentifier);

  if (config.runOnCompile) {
    await bre.run(NAME);
  }

  await runSuper();
});
