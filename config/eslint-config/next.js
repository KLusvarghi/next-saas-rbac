/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = {
  extends: ["@rocketseat/eslint-config/next"],
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    // deixando como "error" ao rodar o lint ele irá identificar e corrigir os imports automaticamnete, diferente do "warn" que apenas avisa
    "simple-import-sort/imports": "error",
  }
};


// import { config as baseConfig } from "./base.js";

// /**
//  * A custom ESLint configuration for libraries that use Next.js.
//  *
//  * @type {import("eslint").Linter.Config[]}
//  * */
// export const nextJsConfig = [
//   ...baseConfig,
//   js.configs.recommended,
//   eslintConfigPrettier,
//   ...tseslint.configs.recommended,
//   {
//     ...pluginReact.configs.flat.recommended,
//     languageOptions: {
//       ...pluginReact.configs.flat.recommended.languageOptions,
//       globals: {
//         ...globals.serviceworker,
//       },
//     },
//   },
//   {
//     plugins: {
//       "@next/next": pluginNext,
//     },
//     rules: {
//       ...pluginNext.configs.recommended.rules,
//       ...pluginNext.configs["core-web-vitals"].rules,
//     },
//   },
//   {
//     plugins: {
//       "react-hooks": pluginReactHooks,
//     },
//     settings: { react: { version: "detect" } },
//     rules: {
//       ...pluginReactHooks.configs.recommended.rules,
//       // React scope no longer necessary with new JSX transform.
//       "react/react-in-jsx-scope": "off",
//     },
//   },
// ];
