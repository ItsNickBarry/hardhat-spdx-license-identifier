import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';

task(TASK_COMPILE, async function (args, hre, runSuper) {
  if (hre.config.spdxLicenseIdentifier.runOnCompile) {
    await hre.run('prepend-spdx-license');
  }

  await runSuper(args);
});
