import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import applicationsRouter from './routes/applications.routes';

const app = express();

app.use(express.json({ strict: false }));
app.use((req, res, next) => {
  req.headers['content-type'] = 'application/json';
  next();
});

app.use('/applications', applicationsRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
