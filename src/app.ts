import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { user2Route } from './users/user2_route.js';
import { userRoute } from './users/user_route.js';

const app = new OpenAPIHono();

app.route('/', userRoute);
app.route('/', user2Route);

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/doc' }));
export default app;
