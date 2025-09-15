/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = {
  extends: ["@rocketseat/eslint-config/node"],
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    // deixando como "error" ao rodar o lint ele irá identificar e corrigir os imports automaticamnete, diferente do "warn" que apenas avisa
    "simple-import-sort/imports": "error",
  }
};
