import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  interface HardhatUserConfig {
    spdxLicenseIdentifier?: {
      overwrite?: boolean;
      runOnCompile?: boolean;
      only?: string[];
      except?: string[];
    };
  }

  interface HardhatConfig {
    spdxLicenseIdentifier: {
      overwrite: boolean;
      runOnCompile: boolean;
      only: string[];
      except: string[];
    };
  }
}
