import './tasks/compile';
import './tasks/prepend_spdx_license';
import { extendConfig } from 'hardhat/config';
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

extendConfig(function (config, userConfig) {
  config.spdxLicenseIdentifier = Object.assign(
    {
      overwrite: false,
      runOnCompile: false,
      only: [],
      except: [],
    },
    userConfig.spdxLicenseIdentifier,
  );
});
