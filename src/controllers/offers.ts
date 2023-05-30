import { Request, Response, NextFunction } from 'express';
import {blockchainCreateOffer, blockchainAssetExists, blockchainGetAllOffers, blockchainGetEcoinsOf} from '../blockchain/chaincode'

const createOffer = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let amount = parseFloat(req.params.amount);
    let price = parseFloat(req.params.price);

    const result = await blockchainCreateOffer(price, amount);

    return res.status(200).json({
        message: result
    });
};

const assetExists = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let id: string = req.params.id;
    
    const result = await blockchainAssetExists(id);

    return res.status(200).json({
        message: result
    });
};

const getAllOffers =async (req: Request, res: Response, next: NextFunction) => {
    const result = await blockchainGetAllOffers();

    return res.status(200).json({
        message: result
    });
}

const getEcoinsOf = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let user: string = req.params.user;
    
    const result = await blockchainGetEcoinsOf(user);

    return res.status(200).json({
        ecoins: result
    });
};

export default { createOffer, assetExists, getAllOffers, getEcoinsOf }