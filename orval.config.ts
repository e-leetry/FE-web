import { defineConfig } from 'orval';

export default defineConfig({
  reetry: {
    output: {
      mode: 'tags-split',
      target: 'lib/api/generated/reetry.ts',
      schemas: 'lib/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      mock: false,
      override: {
        mutator: {
          path: './lib/api/custom-instance.ts',
          name: 'customInstance',
        },
        header: false,
      },
    },
    input: {
      target: './swagger.json', // 또는 백엔드 swagger url: http://localhost:8100/v3/api-docs
    },
  },
});
