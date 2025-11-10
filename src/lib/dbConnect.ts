import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env.local");

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;
  return cached.conn;
}

export default dbConnect;
