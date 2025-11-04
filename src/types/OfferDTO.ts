export type OfferDTO = {
  _id: string;
  fullName: string;
  offerAmount: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};
