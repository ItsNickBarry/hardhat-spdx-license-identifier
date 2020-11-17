import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    spdxLicenseIdentifier?: {
      overwrite?: boolean,
      runOnCompile?: boolean,
    }
  }

  interface HardhatConfig {
    spdxLicenseIdentifier: {
      overwrite: boolean,
      runOnCompile: boolean,
    }
  }
}
