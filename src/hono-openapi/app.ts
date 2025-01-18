import { apiReference } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import { openAPISpecs } from 'hono-openapi';
import { userRoute } from './user-route.js';

const app = new Hono();

app.route('/', userRoute);

app.get(
  '/doc',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono',
        version: '1.0.0',
        description: 'API for greeting users',
      },
    },
  }),
);

// Use the middleware to serve Swagger UI at /ui
app.get(
  '/ui',
  apiReference({
    theme: 'purple',
    spec: {
      url: '/doc',
    },
  }),
);

export default app;
