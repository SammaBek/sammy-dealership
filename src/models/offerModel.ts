import mongoose from "mongoose";

export const offerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  offerAmount: { type: Number, required: true },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});
