/**
 * @fileoverview This rule allow only public api import in FSD
 * @author athead
 */
"use strict";

const { isPathRelative } = require("../helpers");
const { PUBLIC_IMPORT_ERROR, TESTING_IMPORT_ERROR } = require("../helpers/consts");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "This rule allows you to use only public api imports in FSD",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          testFilesPatterns: {
            type: "array",
          },
        },
      },
    ], // Add a schema if the rule has options
    messages: {
      [PUBLIC_IMPORT_ERROR]:
        "Абсолютный импорт разрешен только из Public api (index.ts)",
      [TESTING_IMPORT_ERROR]:
        "Тестовые модули необходимо импортировать только из Testing public api (testing.ts)",
    },
  },

  create(context) {
    const { alias = "", testFilesPatterns = [] } = context.options[0] ?? {};

    const checkingLayers = {
      entities: "entities",
      feautures: "feautures",
      pages: "pages",
      widgets: "widgets",
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, "") : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split("/");
        const layer = segments[0];
        const slice = segments[1];

        if (!checkingLayers[layer]) {
          return;
        }

        const isImportNodeFromPublicApi = segments.length > 2;

        const isTestingPublicApi =
          segments[2] === "testing" && segments.length < 4;

        if (isImportNodeFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: PUBLIC_IMPORT_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(
                node.source,
                `'${alias}/${layer}/${slice}'`
              );
            },
          });
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.filename;
          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(currentFilePath, pattern)
          );
          if (!isCurrentFileTesting) {
            context.report({
              node,
              messageId: TESTING_IMPORT_ERROR,
            });
          }
        }
      },
    };
  },
};
