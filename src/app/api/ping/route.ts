import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database not initialized');

    const result = await db.admin().command({ ping: 1 });

    return NextResponse.json({
      status: 'connected',
      ping: result.ok === 1 ? 'success' : 'failed',
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error: unknown) {
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  return NextResponse.json(
    {
      status: 'error',
      message,
    },
    { status: 500 }
  );
  }
}