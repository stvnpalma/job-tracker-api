// Routes only define the URL and HTTP method, then hand off to the controller.
// Notice how clean this is — no logic here at all.

import { Router } from 'express';

import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getStats,
  updateApplication,
} from '../controllers/applications.controller';

const router = Router();
router.get('/stats', getStats);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
