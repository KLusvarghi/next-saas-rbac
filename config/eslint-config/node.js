/**
 * @type {import("eslint").Linter.Config[]}
 */
module.exports = {
  extends: ['@rocketseat/eslint-config/node'],
  plugins: ['simple-import-sort'],
  rules: {
    // deixando como "error" ao rodar o lint ele irá identificar e corrigir os imports automaticamnete, diferente do "warn" que apenas avisa
    'simple-import-sort/imports': 'error',

    // Desabilita regras do ESLint que conflitam com o Prettier
    quotes: 'off',
    semi: 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': 'off',

    // Desabilita o plugin prettier do ESLint para evitar conflitos
    'prettier/prettier': 'off',
  },
}
