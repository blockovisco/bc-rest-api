import { Request, Response, NextFunction } from 'express';
import {blockchainGetAllAssets, blockchainInit} from '../blockchain/chaincode'

interface Message {
    body: String;
}

const initLedger = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    blockchainInit();
    let msg = "Initialized succesfully"

    return res.status(200).json({
        message: msg
    });
};

const getAllAssets = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    const result = await blockchainGetAllAssets();

    return res.status(200).json({
        message: result
    });
};

export default { initLedger, getAllAssets}