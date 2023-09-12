# eslint-plugin-fsdm

Plugin for fsd metodology

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsdm`:

```sh
npm install eslint-plugin-fsdm --save-dev
```

## Usage

Add `fsd-plugin` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["fsd-plugin"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "fsd-plugin/path-checker": ["error", { "alias": "@" }],
    "fsdm/public-api-imports": [
            "error",
            { "alias": "@", "testFilesPatterns": ["**/*.test.*", "**/*.story.*"] },
        ],
  }
}
```

## Rules

<!-- begin auto-generated rules list -->

TODO: Run eslint-doc-generator to generate the rules list.

<!-- end auto-generated rules list -->
