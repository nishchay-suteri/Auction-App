import { AuctionAccess } from "../dataAccessLayer/auctionAccess";
import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { CreateAuctionRequest } from "../requests/CreateAuctionRequest";
import { PlaceBidRequest } from "../requests/placeBidRequest";

import { createLogger } from "../utils/logger";

import { Forbidden, NotFound, InternalServerError } from "http-errors";

const logger = createLogger("businessLogic-auction");

import * as uuid from "uuid";

const auctionAccess = new AuctionAccess();

export async function createAuctionItem(
    createAuctionRequest: CreateAuctionRequest
): Promise<AuctionItem> {
    logger.info("API - Create Auction Item");
    const timestamp = new Date();
    const endDate = new Date();
    endDate.setHours(timestamp.getHours() + 1);
    const auctionId = uuid.v4();

    const newAuctionItem: AuctionItem = {
        auctionId: auctionId,
        title: createAuctionRequest.title,
        status: "OPEN",
        createdAt: timestamp.toISOString(),
        endingAt: endDate.toISOString(),
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
    let auction: AuctionItem;

    try {
        auction = await auctionAccess.getAuctionById(auctionId);
    } catch (err) {
        throw err;
    }
    if (!auction) {
        logger.error(`API - Get Auction Item by ID: Failure`);
        throw new NotFound(`Auction with ID ${auctionId} Not Found`);
    }

    return auction;
}

export async function getAuctionItems(status: string): Promise<AuctionItem[]> {
    logger.info("API - Get All Auction Items");
    return await auctionAccess.getAuctions(status);
}

export async function updateBidItem(
    placeBidRequest: PlaceBidRequest,
    auctionId: string
): Promise<AuctionItem> {
    logger.info("API - Update Bid Item");

    const auction = await getAuctionItemById(auctionId); // This will throw Key Not found error in case of incalid auctionID

    if (auction.status !== "OPEN") {
        logger.error(`API - Update Bid Item: Failure - Status is not Open`);
        throw new Forbidden(`You can not bid on ${auction.status} Auctions`);
    }

    if (placeBidRequest.amount <= auction.highestBid.amount) {
        logger.error(
            `API - Update Bid Item: Failure - Bid Amount is less than highest amount`
        );
        throw new Forbidden(
            `Your Bid must be higher than ${auction.highestBid.amount}`
        );
    }
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

export async function getEndedAuctionItems(): Promise<AuctionItem[]> {
    logger.info("API - Get All Ended Auction Items");
    const now = new Date();
    const auctionsToClose: AuctionItem[] = await auctionAccess.getEndedAuctions(
        now.toISOString()
    );
    return auctionsToClose;
}

export async function closeAuction(
    auctionsToClose: AuctionItem[]
): Promise<number> {
    logger.info("API - Close All Ended Auction Items");
    const closePromises: Promise<AuctionItem>[] = auctionsToClose.map(
        (auction: AuctionItem) => {
            return auctionAccess.closeAuction(auction.auctionId);
        }
    );
    // Parallel processing: Instead of putting await in each operation, we are waiting to finish all operations at last
    await Promise.all(closePromises);
    return closePromises.length;
}

export async function processAuctionItems() {
    logger.info("API - Processing Auction Items for Closing");
    try {
        const auctionsToClose: AuctionItem[] = await getEndedAuctionItems();
        const closedPromises: number = await closeAuction(auctionsToClose);
        logger.info("API - Processing Auction Items for Closing: Success");
        return { closed: closedPromises };
    } catch (err) {
        logger.error(
            `API - Processing Auction Items for Closing: Failure ${err}`
        );
        throw new InternalServerError(err);
    }
}
