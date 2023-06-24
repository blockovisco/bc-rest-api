import { Request, Response, NextFunction } from 'express';
import {blockchainCreateOffer, blockchainAssetExists, blockchainGetAllOffers, blockchainGetEcoinsOf, blockchainCreateContract} from '../blockchain/chaincode'

const createOffer = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    //:maxAmount/:price/:effectiveDate
    let maxAmount = parseFloat(req.params.maxAmount);
    let price = parseFloat(req.params.price);
    let effectiveDate = req.params.effectiveDate;

    const result = await blockchainCreateOffer(price, maxAmount, effectiveDate);

    return res.status(200).json(result);
};

const assetExists = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let id: string = req.params.id;
    
    const result = await blockchainAssetExists(id);

    return res.status(200).json(result);
};

const getAllOffers =async (req: Request, res: Response, next: NextFunction) => {
    const result = await blockchainGetAllOffers();

    return res.status(200).json(result);
}

const getEcoinsOf = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let user: string = req.params.user;
    
    const result = await blockchainGetEcoinsOf(user);

    return res.status(200).json(result);
};

const createContract = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let offerID = req.params.offerId;

    const result = await blockchainCreateContract(offerID);

    return res.status(200).json(result);
};

export default { createOffer, assetExists, getAllOffers, getEcoinsOf, createContract }