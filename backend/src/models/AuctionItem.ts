import { BidItem } from "./BidItem";
export interface AuctionItem {
    auctionId: string;
    title: string;
    status: string; // TODO: May Change Later
    createdAt: string;
    endingAt: string;
    highestBid: BidItem;
    seller: string;
    attachmentUrl: string;
}
