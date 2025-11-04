import mongoose, { Document, Types } from "mongoose";
export interface CreateClientDTO {
  email: string;
  password: string;
  name: string;
  phone: number;
  favoriteCars: Types.ObjectId[];
  pastOrders: Types.ObjectId[];
}

export interface SignInClientDTO {
  password: string;
  email: string;
}
