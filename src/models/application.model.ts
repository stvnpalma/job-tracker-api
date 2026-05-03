// src/models/application.model.ts
// This is the single source of truth for what an Application looks like.
// Every other file imports from here — nobody defines their own.

export interface Application {
  id: number;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
  notes: string | null;
}

// In-memory data store lives here too — close to the type that defines it
export const applications: Application[] = [
  {
    id: 1,
    company: 'Google',
    role: 'Backend Engineer',
    status: 'applied',
    appliedDate: '2024-01-15',
    notes: null,
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'Node.js Developer',
    status: 'interview',
    appliedDate: '2024-01-20',
    notes: 'Phone screen scheduled for Friday',
  },
];

export const validStatuses: Application['status'][] = [
  'applied',
  'interview',
  'offer',
  'rejected',
];
