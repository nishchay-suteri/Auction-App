import { BidItem } from "./BidItem";
export interface AuctionItem {
    auctionId: string;
    title: string;
    status: string; // TODO: May Change Later
    createdAt: string;
    highestBid: BidItem;
}
