import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error('Please define MONGO_URI in .env.local');

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverApi: { version: '1', strict: true, deprecationErrors: true },
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;
export default dbConnect;