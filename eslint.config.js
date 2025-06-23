import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import react from "eslint-plugin-react"
import jsxA11y from "eslint-plugin-jsx-a11y"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import prettier from "eslint-plugin-prettier"
import nextPlugin from "@next/eslint-plugin-next"

export default [
  { 
    ignores: [
      "dist", 
      ".next", 
      "node_modules",
      "**/*.d.ts"  // Ignore all declaration files
    ] 
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
    plugins: {
      "react": react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tseslint,
      "prettier": prettier,
      "next": nextPlugin,
    },
    settings: {
      "react": {
        version: "detect"
      },
      "next": {
        rootDir: "."
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/jsx-props-no-spreading": "off",
      "react/require-default-props": "off",
      "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
      "react/jsx-one-expression-per-line": "off",
      "react/function-component-definition": ["error", {
        namedComponents: "function-declaration",
        unnamedComponents: "arrow-function"
      }],
      "react/jsx-closing-bracket-location": [
        "warn",
        {
          "selfClosing": "line-aligned",
          "nonEmpty": "tag-aligned"
        }
      ],

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }],
      "@typescript-eslint/no-misused-promises": [
        "warn",
        {
          "checksVoidReturn": {
            "properties": false
          }
        }
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],

      "jsx-a11y/click-events-have-key-events": "off",

      "prettier/prettier": ["warn", {
        "semi": true,
        "singleQuote": false,
        "tabWidth": 2,
        "trailingComma": "all",
        "printWidth": 100,
        "bracketSpacing": true,
        "arrowParens": "always",
        "endOfLine": "auto"
      }]
    }
  }
]