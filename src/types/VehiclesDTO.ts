import { bool } from "aws-sdk/clients/signer";
import { OfferDTO } from "./OfferDTO";

export type VehicleDTO = {
  _id: string;
  make: string;
  type: string;
  year: number;
  vin: string;
  imageUrls: string[];
  name: string;
  description: string;
  price: number;
  isAvailable: bool;
  isOnSale: bool;

  promoStartDate: string;
  promoEndDate: string;
  promoPercentage: number;
  offers: OfferDTO[];
};
