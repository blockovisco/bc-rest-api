import { Request, Response, NextFunction } from 'express';
import {blockchainGetAllAssets, blockchainInit, blockchainCreateEnergy, blockchainCreateEcoin, blockchainCreateProducerAsset} from '../blockchain/chaincode'

const initLedger = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    blockchainInit();
    let msg = "Initialized succesfully"

    return res.status(200).json(msg);
};

const createProducerAsset = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    const result = await blockchainCreateProducerAsset();

    return res.status(200).json(result);
};

const getAllAssets = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    const result = await blockchainGetAllAssets();

    return res.status(200).json(result);
};

const createAsset = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let amount: string = req.params.amount;

    const result = await blockchainCreateEnergy(amount);

    return res.status(200).json(result);
};

const createEcoin = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let amount: string = req.params.amount;

    const result = await blockchainCreateEcoin(amount);

    return res.status(200).json(result);
};

export default { initLedger, getAllAssets, createAsset, createEcoin, createProducerAsset}