import rootConfig, { externalImportOrder } from '../../.prettierrc.mjs';

export default {
  ...rootConfig,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    ...externalImportOrder,
    '',
    '^@app/(.*)$',
    '^@components/(.*)$',
    '^@constants$',
    '^@hooks$',
    '^@hooks-api$',
    '^@hooks-ws$',
    '^@utils$',
    '',
    '^[./]',
    '.+\\.(css|scss)$',
  ],
};
