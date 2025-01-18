import { z } from 'zod';
// For extending the Zod schema with OpenAPI properties
import 'zod-openapi/extend';

import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
import { resolver, validator as zValidator } from 'hono-openapi/zod';

const ParamsSchema = z.object({
  id: z.string().min(3).openapi({
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
  .openapi({
    ref: 'User',
  });

const ErrorSchema = z
  .object({
    code: z.number().openapi({
      example: 400,
    }),
    message: z.string().openapi({
      example: 'Bad Request',
    }),
  })
  .openapi({
    ref: 'MyError',
  });

export const userRoute = new Hono().get(
  '/users/:id',
  describeRoute({
    description: 'Get the user',
    responses: {
      200: {
        description: 'Successful get the user',
        content: {
          'application/json': {
            schema: resolver(UserSchema),
          },
        },
      },
      400: {
        description: 'Returns a validation error',
        content: {
          'application/json': {
            schema: resolver(ErrorSchema),
          },
        },
      },
    },
  }),
  zValidator('param', ParamsSchema, (result, c) => {
    if (!result.success) {
      // 異なる型で返せてしまう
      return c.text('Invalid!', 400);
    }
  }),
  (c) => {
    const { id } = c.req.valid('param');
    // 異なる型で返せてしまう
    return c.json(
      {
        id,
        a: 20,
        name: 'Ultra-man',
      },
      200,
    );
  },
);
