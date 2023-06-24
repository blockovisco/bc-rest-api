import { Request, Response, NextFunction } from 'express';
import {blockchainGetAllAssets, blockchainInit, blockchainCreateEnergy, blockchainCreateEcoin, blockchainCreateProducerAsset, blockchainUpdateProducerAsset, blockchainCreateConsumerAsset, blockchainUpdateConsumerAsset} from '../blockchain/chaincode'

const initLedger = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    blockchainInit();
    let msg = "Initialized succesfully"

    return res.status(200).json(msg);
};

const createProducerAsset = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    let latitude: number = Number(req.params.lat)
    let longtitude: number = Number(req.params.lon)
    
    const result = await blockchainCreateProducerAsset(latitude, longtitude);

    return res.status(200).json(result);
};

const updateProducerAsset = async (req: Request, res: Response, next: NextFunction) => {
    
    let producing: number = Number(req.params.prod);
    
    const result = await blockchainUpdateProducerAsset(producing);

    return res.status(200).json(result);
};

const createConsumerAsset = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    
    let latitude: number = Number(req.params.lat)
    let longtitude: number = Number(req.params.lon)
    
    const result = await blockchainCreateConsumerAsset(latitude, longtitude);

    return res.status(200).json(result);
};

const updateConsumerAsset = async (req: Request, res: Response, next: NextFunction) => {
    
    let receiving: number = Number(req.params.recv);
    
    const result = await blockchainUpdateConsumerAsset(receiving);

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

export default { initLedger, getAllAssets, createAsset, createEcoin, createProducerAsset, updateProducerAsset, createConsumerAsset, updateConsumerAsset}