import '@nomiclabs/buidler/types';

declare module '@nomiclabs/buidler/types' {
  interface BuidlerConfig {
    spdxLicenseIdentifier?: {
       overwrite?: boolean;
       runOnCompile?: boolean;
    };
  }
}
