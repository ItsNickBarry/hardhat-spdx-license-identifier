const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

task(TASK_COMPILE, async function (args, hre, runSuper) {
  if (hre.config.spdxLicenseIdentifier.runOnCompile) {
    await hre.run('prepend-spdx-license');
  }

  await runSuper();
});
