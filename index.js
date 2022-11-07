const { extendConfig } = require('hardhat/config');

require('./tasks/compile.js');
require('./tasks/prepend_spdx_license.js');

extendConfig(function (config, userConfig) {
  config.spdxLicenseIdentifier = Object.assign(
    {
      overwrite: false,
      runOnCompile: false,
      only: [],
      except: [],
    },
    userConfig.spdxLicenseIdentifier
  );
});
