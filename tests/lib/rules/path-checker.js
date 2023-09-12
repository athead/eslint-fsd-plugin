/**
 * @fileoverview feature-sliced relative paths
 * @author athead
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});

ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: "C:\\Users\\user\\work\\project\\src\\Article",
      code: "import { addCommentFormActions } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\user\\Desktop\\project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ messageId: "pathError" }],
    },
    {
      filename: 'C:\\Users\\user\\Desktop\\project\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ messageId: "pathError" }],
      options: [{ alias: "@" }],
    },
  ],
});
