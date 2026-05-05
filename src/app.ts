import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import applicationsRouter from './routes/applications.routes';

const app = express();
app.use(express.json());

app.use('/applications', applicationsRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
