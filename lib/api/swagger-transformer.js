/**
 * @param {import('openapi3-ts/oas31').OpenAPIObject} inputSchema
 * @returns {import('openapi3-ts/oas31').OpenAPIObject}
 */
export default (inputSchema) => {
  const transformedSchema = JSON.parse(JSON.stringify(inputSchema));

  if (transformedSchema.paths) {
    for (const path of Object.values(transformedSchema.paths)) {
      if (!path) continue;

      for (const method of Object.values(path)) {
        if (!method || typeof method !== 'object') continue;

        const operation = method;

        if (operation.responses) {
          for (const response of Object.values(operation.responses)) {
            const content = response?.content?.['application/json'] || response?.content?.['*/*'];
            
            if (content?.schema?.$ref) {
              const ref = content.schema.$ref;
              const schemaName = ref.split('/').pop();

              if (schemaName && schemaName.startsWith('ApiResponse')) {
                const schema = transformedSchema.components?.schemas?.[schemaName];
                if (schema && schema.properties?.data) {
                  content.schema = schema.properties.data;
                }
              }
            }

            if (response?.content?.['*/*']) {
              response.content['application/json'] = response.content['*/*'];
              delete response.content['*/*'];
            }
          }
        }
      }
    }
  }

  return transformedSchema;
};
