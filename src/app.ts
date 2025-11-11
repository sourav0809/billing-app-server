import 'express-async-errors';
import compression from 'compression';
import cors from 'cors';
import express from 'express';

import { SERVER_ENVIRONMENT } from './constants';
import { startAllCronJobs } from './jobs';
import { asyncErrorHandler, errorHandler } from './middlewares/error';
import xss from './middlewares/xss';
import routes from './routes';
import { specs, swaggerUi } from './swagger/swagger';
import { response } from './utils/response';

const app = express();

const rawBodyBuffer = (req: any, res: any, buffer: any, encoding: any) => {
  if (!req.headers['x-signature']) {
    return;
  }

  if (buffer?.length) {
    req.rawBody = buffer.toString(encoding || 'utf8');
  }
};

startAllCronJobs();

// parse json request body
app.use(express.json({ verify: rawBodyBuffer }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, verify: rawBodyBuffer }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());
app.use(cors({ credentials: true, origin: true }));
if (
  process.env.NODE_ENV === SERVER_ENVIRONMENT.TEST ||
  process.env.NODE_ENV === SERVER_ENVIRONMENT.PRODUCTION
) {
  app.use(
    cors({
      credentials: true,
      origin(origin, callback) {
        callback(null, true);
      }
    })
  );
} else {
  app.use(
    cors({
      credentials: true,
      origin: '*'
    })
  );
}

app.use('/api/v1', routes);

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Serve OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Catch-all handler for undefined routes
app.use('*', (req, res) => {
  return response(res, 404, `Route not found`, { route: req.originalUrl });
});

app.use(errorHandler);

app.use(asyncErrorHandler);

export default app;
