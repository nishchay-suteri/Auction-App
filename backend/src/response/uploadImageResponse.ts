import { AuctionItem } from "../models/AuctionItem";

export interface UploadImageResponse {
    updatedItem: AuctionItem;
    uploadUrl: string;
}
