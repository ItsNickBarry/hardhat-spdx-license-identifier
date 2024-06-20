# Hardhat SPDX License Identifier

Prepend Solidity source files in Hardhat projects with the SPDX License Identifier specified in `package.json`.

> Versions of this plugin prior to `2.0.0` were released as `buidler-spdx-license-identifier`.

## Installation

```bash
npm install --save-dev hardhat-spdx-license-identifier
# or
yarn add --dev hardhat-spdx-license-identifier
```

## Usage

Load plugin in Hardhat config:

```javascript
require('hardhat-spdx-license-identifier');
```

Add configuration under the `spdxLicenseIdentifier` key:

| option         | description                                                                                            | default |
| -------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| `overwrite`    | whether to overwrite existing SPDX license identifiers                                                 | `false` |
| `runOnCompile` | whether to automatically prepend identifiers during compilation                                        | `false` |
| `only`         | `Array` of `String` matchers used to select included paths, defaults to all contracts if `length` is 0 | `[]`    |
| `except`       | `Array` of `String` matchers used to exclude paths                                                     | `[]`    |

```javascript
spdxLicenseIdentifier: {
  overwrite: true,
  runOnCompile: true,
  except: ['vendor/']
}
```

The included Hardhat task may be run manually:

```bash
npx hardhat prepend-spdx-license
# or
yarn run hardhat prepend-spdx-license
```

Files which do not contain a license identifier will be prepended with one. Files with a license identifier which does not match that which is specified in `package.json` may be updated, depending on configuration.

## Development

Install dependencies via Yarn:

```bash
yarn install
```

Setup Husky to format code on commit:

```bash
yarn prepare
```
