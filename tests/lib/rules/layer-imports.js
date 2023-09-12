/**
 * @fileoverview layer-imports
 * @author athead
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
  {
    alias: "@",
  },
];

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2015, sourceType: "module" },
});
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename:
        "C:\\project\\src\\features\\Article",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\features\\Article",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\app\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\widgets\\pages",
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\app\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\index.tsx",
      code: "import { StoreProvider } from '@/app/providers/StoreProvider';",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\entities\\Article.tsx",
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: [
        {
          alias: "@",
          ignoreImportPatterns: ["**/StoreProvider"],
        },
      ],
    },
  ],

  invalid: [
    {
      filename:
        "C:\\project\\src\\entities\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\features\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename:
        "C:\\project\\src\\entities\\providers",
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [
        {
          message:
            "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
        },
      ],
      options: aliasOptions,
    },
  ],
});
