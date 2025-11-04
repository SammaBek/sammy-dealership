import { NextResponse } from 'next/server';
import { AppError } from './AppError';

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Fallback for unexpected errors
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}