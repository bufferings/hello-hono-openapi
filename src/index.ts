import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
});

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi('User');

const ErrorSchema = z.object({
  code: z.number().openapi({
    example: 400,
  }),
  message: z.string().openapi({
    example: 'Bad Request',
  }),
});

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema,
        },
      },
      description: 'Returns an error',
    },
  },
});

const index = new OpenAPIHono();

index.openapi(
  route,
  (c) => {
    const { id } = c.req.valid('param');
    return c.json(
      {
        id,
        age: 20,
        name: 'Ultra-man',
      },
      200, // You should specify the status code even if it is 200.
    );
  },
  // Hook
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          code: 400,
          message: 'Validation Error',
        },
        400,
      );
    }
  },
);

// The OpenAPI documentation will be available at /doc
index.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

// Use the middleware to serve Swagger UI at /ui
index.get('/ui', swaggerUI({ url: '/doc' }));

export default index;

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: index.fetch,
  port,
});
