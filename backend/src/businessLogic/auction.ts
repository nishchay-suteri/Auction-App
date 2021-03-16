import { Forbidden, NotFound } from "http-errors";
import { AuctionAccess } from "../dataAccessLayer/auctionAccess";
import { AuctionItem } from "../models/AuctionItem";
import { BidItem } from "../models/BidItem";

import { CreateAuctionRequest } from "../requests/CreateAuctionRequest";
import { PlaceBidRequest } from "../requests/placeBidRequest";

import { getUserEmail } from "../utils/auth/utils";

import { createLogger } from "../utils/logger";
const logger = createLogger("businessLogic-auction");

import * as uuid from "uuid";

const auctionAccess = new AuctionAccess();

export async function createAuctionItem(
    createAuctionRequest: CreateAuctionRequest,
    jwtToken: string
): Promise<AuctionItem> {
    logger.info("API - Create Auction Item");
    const timestamp = new Date();
    const endDate = new Date();
    endDate.setHours(timestamp.getHours() + 1);
    const auctionId = uuid.v4();
    const userEmail: string = getUserEmail(jwtToken);

    const newAuctionItem: AuctionItem = {
        auctionId: auctionId,
        title: createAuctionRequest.title,
        status: "OPEN",
        createdAt: timestamp.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
            bidder: "", // Default, there is no bidder
        },
        seller: userEmail,
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
    auctionId: string,
    jwtToken: string
): Promise<AuctionItem> {
    logger.info("API - Update Bid Item");

    const auction = await getAuctionItemById(auctionId); // This will throw Key Not found error in case of incalid auctionID

    // Auction Status Validation
    if (auction.status !== "OPEN") {
        logger.error(`API - Update Bid Item: Failure - Status is not Open`);
        throw new Forbidden(`You can not bid on ${auction.status} Auctions`);
    }

    // Bid amount validation
    if (placeBidRequest.amount <= auction.highestBid.amount) {
        logger.error(
            `API - Update Bid Item: Failure - Bid Amount is less than highest amount`
        );
        throw new Forbidden(
            `Your Bid must be higher than ${auction.highestBid.amount}`
        );
    }

    const bidderEmail: string = getUserEmail(jwtToken);

    // Bidder Identity validation
    if (bidderEmail === auction.seller) {
        logger.error(
            `API - Update Bid Item: Failure - User and Bidder are same`
        );
        throw new Forbidden(`You can't bid on your own auctions!`);
    }

    // Avoid double bidding
    if (bidderEmail === auction.highestBid.bidder) {
        logger.error(
            `API - Update Bid Item: Failure - Bidder is already highest Bidder`
        );
        throw new Forbidden(`You are already the highest bidder`);
    }

    const updatedBid: BidItem = {
        amount: placeBidRequest.amount,
        bidder: bidderEmail,
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
