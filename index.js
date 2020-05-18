const {
  TASK_COMPILE_GET_RESOLVED_SOURCES,
} = require('@nomiclabs/buidler/builtin-tasks/task-names');

const fs = require('fs');

const NAME = 'prepend-spdx-license';
const DESC = 'Prepends SPDX License identifier to local source files';

task(NAME, DESC, async function (args, bre) {
  let packageJson = JSON.parse(fs.readFileSync(`${ bre.config.paths.root }/package.json`, 'utf8'));
  let spdx;

  if (packageJson.license) {
    spdx = packageJson.license;
  } else {
    console.log('No license specified in package.json');
    spdx = 'UNLICENSED';
  }

  let sources = await bre.run(TASK_COMPILE_GET_RESOLVED_SOURCES);

  console.log(`Prepending SPDX License Identifier to ${ sources.length } sources: ${ spdx }`);

  let headerBase = '// SPDX-License-Identifier:';
  let regexp = new RegExp(`(${ headerBase }.*\n*)?`);
  let header = `${ headerBase } ${ spdx }\n\n`;

  sources.forEach(function ({ absolutePath, content }) {
    if (!content.startsWith(header)) {
      fs.writeFileSync(absolutePath, content.replace(regexp, header));
    }
  });
});
