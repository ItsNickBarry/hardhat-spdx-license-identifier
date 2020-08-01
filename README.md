# Buidler SPDX License Identifer

Prepend Solidity source files in Buidler projects with the SPDX License Identifier specified in `package.json`.

## Installation

```bash
yarn add --dev buidler-spdx-license-identifier
```

## Usage

Load plugin in Buidler config:

```javascript
usePlugin('buidler-spdx-license-identifier');
```

Add configuration under the `spdxLicenseIdentifier` key:

| option | description | default |
|-|-|-|
| `overwrite` | whether to overwrite existing SPDX license identifiers | `false` |
| `runOnCompile` | whether to automatically prepend identifiers during compilation | `false` |

```javascript
spdxLicenseIdentifier: {
  overwrite: true,
  runOnCompile: true,
}
```
Run the included Buidler task to modify local Solidity source files:

```bash
yarn run buidler prepend-spdx-license
```

Files which do not contain a license identifier will be prepended with one.  Files with a license identifier which does not match that which is specified in `package.json` will be updated.
