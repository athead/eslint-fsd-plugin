/**
 * @fileoverview feature-sliced relative paths
 * @author athead
 */
"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Feature-sliced relative paths checker",
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
        },
      },
    ], // Add a schema if the rule has options
    messages: {
      pathError: "В рамках одного слайса пути должны быть относительными",
    },
  },

  create(context) {
    const alias = context.options[0]?.alias || "";
    return {
      ImportDeclaration(node) {
        try {
          // app/entities/Article
          const value = node.source.value;
          const importTo = alias ? value.replace(`${alias}/`, "") : value;

          // exact file
          const fromFilename = context.filename;

          if (shouldBeRalative(fromFilename, importTo)) {
            context.report({
              node,
              messageId: "pathError",
              fix: (fixer) => {
                const normalizedPath = getNormalizedCurrentFilepath(
                  fromFilename
                )
                  .split("/")
                  .slice(0, -1)
                  .join("/");

                let relativePath = path
                  .relative(normalizedPath, `/${importTo}`)
                  .split("\\")
                  .join("/");
                if (!relativePath.startsWith(".")) {
                  relativePath = "./" + relativePath;
                }
                return fixer.replaceText(node.source, `'${relativePath}'`);
              },
            });
          }
        } catch (error) {
          console.log(error)
        }
      },
    };
  },
};

const layers = {
  entities: "entities",
  feautures: "feautures",
  shared: "shared",
  pages: "pages",
  widgets: "widgets",
};

function getNormalizedCurrentFilepath(currentFilePath) {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split("src")[1];
  return projectFrom.split("\\").join("/");
}

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

  const projectFrom = getNormalizedCurrentFilepath(from);
  const fromArray = projectFrom.split("/");

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
