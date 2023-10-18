import { Request, Response, NextFunction } from 'express';
import {blockchainGetAllAssets, blockchainCreateEcoin, blockchainCreateProducerAsset, blockchainUpdateProducerAsset, blockchainCreateConsumerAsset, blockchainUpdateConsumerAsset, blockchainAddEcoin} from '../blockchain/chaincode'
import { peerHostAlias } from '../config';

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

const createEcoin = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let amount: string = req.params.amount;

    const result = await blockchainCreateEcoin(amount);

    return res.status(200).json(result);
};

const addEcoins = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let amount: string = req.params.amount;

    const result = await blockchainAddEcoin(amount);

    return res.status(200).json(result);
};

export default { getAllAssets, createEcoin, createProducerAsset, updateProducerAsset, createConsumerAsset, updateConsumerAsset, addEcoins}