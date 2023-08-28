/**
 * @fileoverview feature-sliced relative paths
 * @author athead
 */
"use strict";

const path = require("path");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature-sliced relative paths",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      pathError: "В рамках одного слайса пути должны быть относительными",
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // app/entities/Article
        const importTo = node.source.value;

        // exact file
        const fromFilename = context.filename;

        if (shouldBeRalative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: "pathError",
          });
        }
      },
    };
  },
};

function isPathRelative(path) {
  return path === "." || path.startsWith("./") || path.startsWith("../");
}

const layers = {
  entities: "entities",
  feautures: "feautures",
  shared: "shared",
  pages: "pages",
  widgets: "widgets",
};

function shouldBeRalative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split("/");
  const toLayer = toArray[0]; // layer
  const toSlice = toArray[1]; // slice

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split("src")[1];
  const fromArray = projectFrom.split("\\");

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
