import { Request, Response, NextFunction } from 'express';
import { blockchainCreateSellOffer, blockchainAssetExists, blockchainGetAllOffers, blockchainGetEcoinsOf, blockchainCreateContract, blockchainAddPeerContract, blockchainCreatePeerContract, blockchainGetPeerContract, blockchainGetListOfEnergyOf, blockchainExecuteOffer } from '../blockchain/chaincode'
import { getEnergyOfUser } from '../blockchain/contracts';
import getEnergyOfThisUser from './assets'
import { peerHostAlias } from '../config';

const createOffer = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    //:maxAmount/:price/:effectiveDate
    let amount = parseFloat(req.params.amount);
    let price = parseFloat(req.params.price);

    const result = await blockchainCreateSellOffer(price, amount);
    return res.status(200).json(result);

};

const assetExists = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let id: string = req.params.id;

    const result = await blockchainAssetExists(id);

    return res.status(200).json(result);
};

const getAllOffers = async (req: Request, res: Response, next: NextFunction) => {
    const result = await blockchainGetAllOffers();

    return res.status(200).json(result);
}

const getEcoinsOf = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    let user: string = req.params.user;

    const result = await blockchainGetEcoinsOf(user);

    return res.status(200).json(result);
};

const getEcoinsOfThisUser = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts

    const result = await blockchainGetEcoinsOf(peerHostAlias);

    return res.status(200).json(result);
};

const createContract = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let offerID = req.params.offerId;

    const result = await blockchainCreateContract(offerID);

    return res.status(200).json(result);
};

const createPeerContract = async (req: Request, res: Response, next: NextFunction) => {

    const result = await blockchainCreatePeerContract();

    return res.status(200).json(result);
};

const addPeerContract = async (req: Request, res: Response, next: NextFunction) => {
    // get some posts
    let contractId = req.params.contractId;

    const result = await blockchainAddPeerContract(contractId);

    return res.status(200).json(result);
};

const getPeerContract = async (req: Request, res: Response, next: NextFunction) => {

    const result = await blockchainGetPeerContract();

    return res.status(200).json(result);
};

const executeOffer = async (req: Request, res: Response, next: NextFunction) => {

    let offerId = req.params.id
    const result = await blockchainExecuteOffer(offerId);

    return res.status(200).json(result);
}

export default { createOffer, assetExists, getAllOffers, getEcoinsOf, getEcoinsOfThisUser, createContract, createPeerContract, addPeerContract, getPeerContract, executeOffer }