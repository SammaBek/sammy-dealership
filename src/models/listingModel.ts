import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  carId: { type: String, required: true, ref: 'Car' }, // Reference to carModel
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  model: { type: String, required: true, trim: true },
 imageUrls: [{ type: String, trim: true }],
  mileage: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  isOnSale: { type: Boolean, default: false },
  promoStartDate: { type: Date },
  promoEndDate: { type: Date },
  promoPercentage: { type: Number },
}, { timestamps: true }); 
const listingModel = mongoose.model('Listing', listingSchema);
export default listingModel;