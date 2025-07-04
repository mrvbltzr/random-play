/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    editorconfig: true,
    printWidth: 120,
    singleQuote: true,
    trailingComma: 'es5',
    arrowParens: 'always',
    quoteProps: 'consistent',
    plugins: ['@trivago/prettier-plugin-sort-imports'],
    importOrder: ['^@/(?:[^/]+/)*constants$', '^@/(.*)$', '^[./]', '^@/types(.*)$'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
};

export default config;
