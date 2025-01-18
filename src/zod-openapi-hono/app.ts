import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { userRoute } from './user-route.js';

const app = new OpenAPIHono();

app.route('/', userRoute);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

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
