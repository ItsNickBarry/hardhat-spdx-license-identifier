import { license } from '../../package.json';
import { expect } from 'chai';
import fs from 'fs';
import hre from 'hardhat';
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names';

const TASK_PREPEND_SPDX_LICENSE = 'prepend-spdx-license';
const HEADER_BASE = '// SPDX-License-Identifier:';

const readContractSource = async (name: string) => {
  const artifact = await hre.artifacts.readArtifact(name);
  return fs.readFileSync(artifact.sourceName).toString();
};

describe(TASK_PREPEND_SPDX_LICENSE, () => {
  const cache: { [sourcePath: string]: string } = {};

  before(async () => {
    const sourcePaths: string[] = await hre.run(
      TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
    );

    for (const sourcePath of sourcePaths) {
      cache[sourcePath] = fs.readFileSync(sourcePath).toString();
    }
  });

  afterEach(async () => {
    for (const sourcePath in cache) {
      fs.writeFileSync(sourcePath, cache[sourcePath]);
    }
  });

  it('writes license identifier to top of source file', async () => {
    const contentsBefore = await readContractSource('ContractWithoutLicense');
    expect(contentsBefore.includes(HEADER_BASE)).to.be.false;

    await hre.run(TASK_PREPEND_SPDX_LICENSE);

    const contentsAfter = await readContractSource('ContractWithoutLicense');
    expect(contentsAfter.includes(`${HEADER_BASE} ${license}`)).to.be.true;
  });

  it('does not write duplicate license identifiers', async () => {
    const reg = new RegExp(HEADER_BASE, 'g');

    const contentsBefore = await readContractSource('ContractWithLicense');
    expect((contentsBefore.match(reg) ?? []).length).to.equal(1);

    await hre.run(TASK_PREPEND_SPDX_LICENSE);

    const contentsAfter = await readContractSource('ContractWithLicense');
    expect((contentsAfter.match(reg) ?? []).length).to.equal(1);
  });
});
