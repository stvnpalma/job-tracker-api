// This is the LAST middleware in the chain.
// Any error thrown anywhere in the app lands here.
// Four parameters is how Express identifies error handlers.

import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Known operational errors — expected and handled (AppError, NotFoundError, etc.)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  // 2. Handle Prisma-specific database errors safely without "as any"
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma unique constraint violation
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'A record with this data already exists',
      });
      return;
    }

    // Prisma record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Record not found',
      });
      return;
    }
  }

  // 3. Unknown errors — don't leak details in production
  console.error('Unhandled error:', err);

  res.status(500).json({
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
};

// 404 handler — catches requests to routes that don't exist
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found`,
  });
};
