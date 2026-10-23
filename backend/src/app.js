import cors from 'cors';
import express from 'express';
import investigateRoutes from './routes/investigate.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '20kb' }));
app.use('/api', investigateRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
