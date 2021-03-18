import { AuctionItem } from "../models/AuctionItem";

export interface UploadImageResponse {
    updatedItem: AuctionItem;
    signedUrl: string;
}
