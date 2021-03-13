import { AuctionAccess } from "../dataAccessLayer/auctionAccess";
import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { CreateAuctionRequest } from "../requests/CreateAuctionRequest";
import { PlaceBidRequest } from "../requests/placeBidRequest";

import { createLogger } from "../utils/logger";

const logger = createLogger("businessLogic-auction");

import * as uuid from "uuid";

const auctionAccess = new AuctionAccess();

export async function createAuctionItem(
    createAuctionRequest: CreateAuctionRequest
): Promise<AuctionItem> {
    logger.info("API - Create Auction Item");
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
    logger.info("API - Get Auction Item by ID");
    return await auctionAccess.getAuctionById(auctionId);
}

export async function getAuctionItems(): Promise<AuctionItem[]> {
    logger.info("API - Get All Auction Items");
    return await auctionAccess.getAuctions();
}

export async function updateBidItem(
    placeBidRequest: PlaceBidRequest,
    auctionId: string
): Promise<AuctionItem> {
    await getAuctionItemById(auctionId); // This will throw Key Not found error in case of incalid auctionID
    logger.info("API - Update Bid Item");
    const updatedBid: BidItem = {
        amount: placeBidRequest.amount,
    };
    return await auctionAccess.updateBid(auctionId, updatedBid);
}

export async function deleteAuctionItem(auctionId: string) {
    // TODO: Check if Id Exists or not.. i.e. whether auctions is set or undefined
    logger.info("API - Delete Auction Item");
    return await auctionAccess.deleteAuction(auctionId);
}
