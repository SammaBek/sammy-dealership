import mongoose from "mongoose";
import { offerSchema } from "models/offerModel";
const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    make: { type: String, required: true },
    year: { type: String, required: true },
    vin: { type: String, required: true, unique: true },
    imageUrls: [{ type: String, trim: true }],
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isOnSale: { type: Boolean, default: false },
    promoStartDate: { type: Date },
    promoEndDate: { type: Date },
    promoPercentage: { type: Number },
    price: { type: Number },
    offers: {
      type: [offerSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const carModel = mongoose.models.Car || mongoose.model("Car", carSchema);
export default carModel;
