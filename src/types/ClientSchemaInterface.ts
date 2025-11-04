import mongoose, { Document, Types } from "mongoose";

export interface IClient extends Document {
  name: string;
  email: string;
  password: string;
  phone: number;
  favoriteCars: Types.ObjectId[];
  pastOrders: Types.ObjectId[];
}
