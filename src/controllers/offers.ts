import { Request, Response, NextFunction } from 'express';
import {blockchainCreateOffer, blockchainAssetExists} from '../blockchain/chaincode'

const createOffer = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let price = 1.2
    let amount = 5

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

export default { createOffer, assetExists}