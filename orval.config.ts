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
      target: './swagger.json',
      override: {
        transformer: './lib/api/swagger-transformer.ts',
      },
    },
  },
});
