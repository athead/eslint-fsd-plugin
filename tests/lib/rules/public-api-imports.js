/**
 * @fileoverview This rule allow only public api import in FSD
 * @author athead
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { action } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { action } from '@/entities/Article'",
      errors: [],
      options: [
        {
          alias: "@",
        },
      ],
    },
    {
      filename: "C:\\Users\\user\\project\\src\\entities\\file.test.ts",
      code: "import { action } from '@/entities/Article/testing'",
      errors: [],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
    {
      filename: "C:\\Users\\user\\project\\src\\entities\\StoreDecorator.tsx",
      code: "import { action } from '@/entities/Article/testing'",
      errors: [],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
    },
  ],

  invalid: [
    {
      code: "import { action } from '@/entities/Article/model/file.ts'",
      errors: [
        {
          messageId: "IMPORT_ERROR",
        },
      ],
      options: [
        {
          alias: "@",
        },
      ],
      output: "import { action } from '@/entities/Article'",
    },
    {
      filename: "C:\\Users\\user\\project\\src\\entities\\StoreDecorator.tsx",
      code: "import { action } from '@/entities/Article/testing/file.tsx'",
      errors: [
        {
          messageId: "IMPORT_ERROR",
        },
      ],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
      output: "import { action } from '@/entities/Article'",
    },
    {
      filename: "C:\\Users\\user\\project\\src\\entities\\forbidden.ts",
      code: "import { action } from '@/entities/Article/testing'",
      errors: [
        {
          messageId: "TESTING_ERROR",
        },
      ],
      options: [
        {
          alias: "@",
          testFilesPatterns: ["**/*.test.ts", "**/StoreDecorator.tsx"],
        },
      ],
      output: null
    },
  ],
});
