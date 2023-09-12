/**
 * @fileoverview layer-imports
 * @author athead
 */
"use strict";

const { isPathRelative } = require("../helpers");
const micromatch = require("micromatch");
const path = require("path");
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check that imports contains only lower level layers",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          },
          ignoreImportPatterns: {
            type: "array",
          },
        },
      },
    ],
    messages: {
      importError:
        "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
    },
  },

  create(context) {
    const layers = {
      app: ["pages", "widgets", "features", "shared", "entities"],
      pages: ["widgets", "features", "shared", "entities"],
      widgets: ["features", "shared", "entities"],
      features: ["shared", "entities"],
      entities: ["shared", "entities"],
      shared: ["shared"],
    };

    const availableLayers = {
      app: "app",
      entities: "entities",
      features: "features",
      shared: "shared",
      pages: "pages",
      widgets: "widgets",
    };

    const { alias = "", ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.filename;

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split("src")[1];
      const segments = projectPath?.split("\\");

      return segments?.[1];
    };

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, "") : value;
      const segments = importPath?.split("/");

      return segments?.[0];
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (
          !availableLayers[importLayer] ||
          !availableLayers[currentFileLayer]
        ) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({ node: node, messageId: "importError" });
        }
      },
    };
  },
};
