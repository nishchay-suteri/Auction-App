import { AuctionAccess } from "../dataAccessLayer/auctionAccess";
import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { CreateAuctionRequest } from "../requests/CreateAuctionRequest";
import { PlaceBidRequest } from "../requests/placeBidRequest";

import * as uuid from "uuid";

const auctionAccess = new AuctionAccess();

export async function createAuctionItem(
    createAuctionRequest: CreateAuctionRequest
): Promise<AuctionItem> {
    const timestamp = new Date().toISOString();
    const auctionId = uuid.v4();

    const newAuctionItem: AuctionItem = {
        auctionId: auctionId,
        title: createAuctionRequest.title,
        status: "OPEN",
        createdAt: timestamp,
        highestBid: {
            amount: 0,
        },
    };
    return await auctionAccess.createAuction(newAuctionItem);
}

export async function getAuctionItemById(
    auctionId: string
): Promise<AuctionItem> {
    return await auctionAccess.getAuctionById(auctionId);
}

export async function getAuctionItems(): Promise<AuctionItem[]> {
    return await auctionAccess.getAuctions();
}

export async function updateBidItem(
    placeBidRequest: PlaceBidRequest,
    auctionId: string
): Promise<AuctionItem> {
    // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined

    const updatedBid: BidItem = {
        amount: placeBidRequest.amount,
    };
    return await auctionAccess.updateBid(auctionId, updatedBid);
}

export async function deleteBidItem(auctionId: string) {
    // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined
    return await auctionAccess.deleteAuction(auctionId);
}
