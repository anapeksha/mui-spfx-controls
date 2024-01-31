require("@rushstack/eslint-config/patch/modern-module-resolution");
module.exports = {
  extends: ["@microsoft/eslint-config-spfx/lib/profiles/react"],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2018,
        sourceType: "module",
      },
      rules: {
        "@rushstack/no-new-null": 1,
        "@rushstack/hoist-jest-mock": 1,
        "@rushstack/security/no-unsafe-regexp": 1,
        "@typescript-eslint/adjacent-overload-signatures": 1,
        "@typescript-eslint/ban-types": [
          1,
          {
            extendDefaults: false,
            types: {
              String: {
                message: "Use 'string' instead",
                fixWith: "string",
              },
              Boolean: {
                message: "Use 'boolean' instead",
                fixWith: "boolean",
              },
              Number: {
                message: "Use 'number' instead",
                fixWith: "number",
              },
              Object: {
                message:
                  "Use 'object' instead, or else define a proper TypeScript type:",
              },
              Symbol: {
                message: "Use 'symbol' instead",
                fixWith: "symbol",
              },
              Function: {
                message:
                  "The 'Function' type accepts any function-like value.\nIt provides no type safety when calling the function, which can be a common source of bugs.\nIt also accepts things like class declarations, which will throw at runtime as they will not be called with 'new'.\nIf you are expecting the function to accept certain arguments, you should explicitly define the function shape.",
              },
            },
          },
        ],
        "@typescript-eslint/explicit-function-return-type": [
          1,
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: false,
          },
        ],
        "@typescript-eslint/explicit-member-accessibility": 0,
        "@typescript-eslint/no-array-constructor": 1,
        "@typescript-eslint/no-explicit-any": 1,
        "@typescript-eslint/no-floating-promises": 2,
        "@typescript-eslint/no-for-in-array": 2,
        "@typescript-eslint/no-misused-new": 2,
        "@typescript-eslint/no-namespace": [
          1,
          {
            allowDeclarations: false,
            allowDefinitionFiles: false,
          },
        ],
        "@typescript-eslint/parameter-properties": 0,
        "@typescript-eslint/no-unused-vars": [
          1,
          {
            vars: "all",
            args: "none",
          },
        ],
        "@typescript-eslint/no-use-before-define": [
          2,
          {
            functions: false,
            classes: true,
            variables: true,
            enums: true,
            typedefs: true,
          },
        ],
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-namespace-keyword": 1,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-empty-interface": 0,
        "accessor-pairs": 1,
        "dot-notation": [
          1,
          {
            allowPattern: "^_",
          },
        ],
        eqeqeq: 1,
        "for-direction": 1,
        "guard-for-in": 2,
        "max-lines": ["warn", { max: 2000 }],
        "no-async-promise-executor": 2,
        "no-caller": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-compare-neg-zero": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-cond-assign": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-constant-condition": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-control-regex": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-debugger": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-delete-var": 2,
        // RATIONALE:         Catches code that is likely to be incorrect
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-duplicate-case": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-empty": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-empty-character-class": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-empty-pattern": 1,
        // RATIONALE:         Eval is a security concern and a performance concern.
        "no-eval": 1,
        // RATIONALE:         Catches code that is likely to be incorrect
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-ex-assign": 2,
        // RATIONALE:         System types are global and should not be tampered with in a scalable code base.
        //                    If two different libraries (or two versions of the same library) both try to modify
        //                    a type, only one of them can win.  Polyfills are acceptable because they implement
        //                    a standardized interoperable contract, but polyfills are generally coded in plain
        //                    JavaScript.
        "no-extend-native": 1,
        // Disallow unnecessary labels
        "no-extra-label": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-fallthrough": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-func-assign": 1,
        // RATIONALE:         Catches a common coding mistake.
        "no-implied-eval": 2,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-invalid-regexp": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-label-var": 2,
        // RATIONALE:         Eliminates redundant code.
        "no-lone-blocks": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-misleading-character-class": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-multi-str": 2,
        // RATIONALE:         It's generally a bad practice to call "new Thing()" without assigning the result to
        //                    a variable.  Either it's part of an awkward expression like "(new Thing()).doSomething()",
        //                    or else implies that the constructor is doing nontrivial computations, which is often
        //                    a poor class design.
        "no-new": 1,
        // RATIONALE:         Obsolete language feature that is deprecated.
        "no-new-func": 2,
        // RATIONALE:         Obsolete language feature that is deprecated.
        "no-new-object": 2,
        // RATIONALE:         Obsolete notation.
        "no-new-wrappers": 1,
        // RATIONALE:         Catches code that is likely to be incorrect
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-octal": 2,
        // RATIONALE:         Catches code that is likely to be incorrect
        "no-octal-escape": 2,
        // RATIONALE:         Catches code that is likely to be incorrect
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-regex-spaces": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-return-assign": 2,
        // RATIONALE:         Security risk.
        "no-script-url": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-self-assign": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-self-compare": 2,
        // RATIONALE:         This avoids statements such as "while (a = next(), a && a.length);" that use
        //                    commas to create compound expressions.  In general code is more readable if each
        //                    step is split onto a separate line.  This also makes it easier to set breakpoints
        //                    in the debugger.
        "no-sequences": 1,
        // RATIONALE:         Catches code that is likely to be incorrect
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-shadow-restricted-names": 2,
        // RATIONALE:         Obsolete language feature that is deprecated.
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-sparse-arrays": 2,
        // RATIONALE:         Although in theory JavaScript allows any possible data type to be thrown as an exception,
        //                    such flexibility adds pointless complexity, by requiring every catch block to test
        //                    the type of the object that it receives.  Whereas if catch blocks can always assume
        //                    that their object implements the "Error" contract, then the code is simpler, and
        //                    we generally get useful additional information like a call stack.
        "no-throw-literal": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-unmodified-loop-condition": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-unsafe-finally": 2,
        // RATIONALE:         Catches a common coding mistake.
        "no-unused-expressions": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-unused-labels": 1,
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-useless-catch": 1,
        // RATIONALE:         Avoids a potential performance problem.
        "no-useless-concat": 1,
        // RATIONALE:         The "var" keyword is deprecated because of its confusing "hoisting" behavior.
        //                    Always use "let" or "const" instead.
        //
        // STANDARDIZED BY:   @typescript-eslint\eslint-plugin\dist\configs\recommended.json
        "no-var": 2,
        // RATIONALE:         Generally not needed in modern code.
        "no-void": 1,
        // RATIONALE:         Obsolete language feature that is deprecated.
        // STANDARDIZED BY:   eslint\conf\eslint-recommended.js
        "no-with": 2,
        // RATIONALE:         Makes logic easier to understand, since constants always have a known value
        // @typescript-eslint\eslint-plugin\dist\configs\eslint-recommended.js
        "prefer-const": 1,
        // RATIONALE:         Catches a common coding mistake where "resolve" and "reject" are confused.
        "promise/param-names": 2,
        "require-atomic-updates": 2,
        "require-yield": 1,
        strict: [2, "never"],
        "use-isnan": 2,
        "no-extra-boolean-cast": 0,
        "@microsoft/spfx/import-requires-chunk-name": 1,
        "@microsoft/spfx/no-require-ensure": 2,
        "@microsoft/spfx/pair-react-dom-render-unmount": 1,
      },
    },
    {
      files: [
        "*.test.ts",
        "*.test.tsx",
        "*.spec.ts",
        "*.spec.tsx",
        "**/__mocks__/*.ts",
        "**/__mocks__/*.tsx",
        "**/__tests__/*.ts",
        "**/__tests__/*.tsx",
        "**/test/*.ts",
        "**/test/*.tsx",
      ],
      rules: {},
    },
  ],
};
