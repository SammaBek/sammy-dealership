import mongoose, { Document, Types } from "mongoose";
import { IClient } from "@/types/ClientSchemaInterface";
const clientSchema = new mongoose.Schema<IClient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    favoriteCars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    pastOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  },
  { timestamps: true }
);

const Client =
  mongoose.models.Client || mongoose.model<IClient>("Client", clientSchema);

export default Client;
