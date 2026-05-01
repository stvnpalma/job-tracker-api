// This file only sets up Express and wires up routes.
// No logic lives here — that's the controller's job.

import express from 'express';
import applicationsRouter from './routes/applications.routes';

const app = express();
app.use(express.json());

// all /applications routes are handled by the router
app.use('/applications', applicationsRouter);

export default app;
