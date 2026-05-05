// Now that Prisma generates our types from the database schema,
// we import them directly from Prisma instead of defining them manually.
// This ensures our TypeScript types always match the database.

import { Application, Status } from '@prisma/client';

export type { Application };

export const validStatuses: Status[] = [
  'applied',
  'interview',
  'offer',
  'rejected',
];
