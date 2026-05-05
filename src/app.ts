import express from 'express';
import applicationsRouter from './routes/applications.routes';

const app = express();
app.use(express.json());

app.use('/applications', applicationsRouter);

export default app;
