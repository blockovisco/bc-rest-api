import { Request, Response, NextFunction } from 'express';
import {blockchainCreateOffer} from '../blockchain/chaincode'

const getAllOffers = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let price = 1.2
    let amount = 5

    const result = await blockchainCreateOffer(price, amount);

    return res.status(200).json({
        message: result
    });
};

export default { getAllOffers}