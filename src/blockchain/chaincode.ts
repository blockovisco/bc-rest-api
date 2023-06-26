/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import e from 'express';
import { promises as fs } from 'fs';
import * as path from 'path';
import { certPath, cryptoPath, keyDirectoryPath, peerEndpoint, peerHostAlias, tlsCertPath } from '../config';
import * as contracts from './contracts'

const channelName = 'mychannel';
const chaincodeName = 'mysc'
const mspId = 'Org2MSP'


export const blockchainCreateProducerAsset = async (latitude: number, longtitude: number) => {
    return await connectAndExecute(contracts.createProducerAsset, [peerHostAlias, String(latitude), String(longtitude)]);
}

export const blockchainCreateConsumerAsset = async (latitude: number, longtitude: number) => {
    return await connectAndExecute(contracts.createConsumerAsset, [peerHostAlias, String(latitude), String(longtitude)]);
}

export const blockchainGetAllAssets = async () => {
    return await connectAndExecute(contracts.getAllAssets, []);
}

export const blockchainReadAsset = async (id: string) => {
    return await connectAndExecute(contracts.readAssetByID, [id]);
}

export const blockchainGetPeerContract = async (): Promise<JSON> => {
    return await connectAndExecute(contracts.getPeerContract, [peerHostAlias]);
}

export const blockchainInit = async () => {
    await connectAndExecute(contracts.initLedger, []);
}

export const blockchainCreateEnergy = async (amount: string) => {
    return await connectAndExecute(contracts.createEnergyAsset, [amount, peerHostAlias])
}

export const blockchainCreateEcoin = async (amount: string) => {
    return await connectAndExecute(contracts.createEcoinAsset, [amount, peerHostAlias])
}
// price, maxAmount, effectiveDate
export const blockchainCreateOffer = async(price: number, maxAmount: number, effectiveDate: string) => {
    return await connectAndExecute(contracts.createOffer, [price.toString(), maxAmount.toString(), effectiveDate, peerHostAlias])
}

export const blockchainAssetExists = async(id: string) => {
    return await connectAndExecute(contracts.assetExists, [id])
}

export const blockchainGetAllOffers = async () => {
    return await connectAndExecute(contracts.getAllOffers, []);
}

export const blockchainGetListOfEcoinsOf = async function(user: string) {
    return await connectAndExecute(contracts.getEcoinsOfUser, [user])
}

export const blockchainGetListOfEnergyOf = async function(user: string) {
    return await connectAndExecute(contracts.getEnergyOfUser, [user])
}

export const blockchainGetEcoinsOf = async function(user: string) {
    return await contracts.getSumOfEcoinsOf(user)
}

export const blockchainUnifyEnergyAsset = async (mod?: string) => {
    if(mod != undefined) {
        return await connectAndExecute(contracts.unifyEcoinAssets, [peerHostAlias, mod])
    }
    return await connectAndExecute(contracts.unifyEcoinAssets, [peerHostAlias])
}

export const blockchainUpdateProducerAsset = async function(producing: number) {
    return await connectAndExecute(contracts.updateProducerAsset, [peerHostAlias, String(producing)]);
}

export const blockchainUpdateConsumerAsset = async function(receiving: number) {
    return await connectAndExecute(contracts.updateConsumerAsset, [peerHostAlias, String(receiving)]);
}

export const blockchainCreateContract = async(offerId: string) => {
    return await connectAndExecute(contracts.createContract, [offerId, peerHostAlias])
}

export const blockchainCreatePeerContract = async() => {
    return await connectAndExecute(contracts.createPeerContract, [peerHostAlias])
}

export const blockchainAddPeerContract = async(contractId: string) => {
    return await connectAndExecute(contracts.addPeerContract, [peerHostAlias, contractId])
}

const connectAndExecute = async (func: Function, args: Array<string>) => {
    var result = null;

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        // Initialize a set of asset data on the ledger using the chaincode 'InitLedger' function.
        result = await func(contract, args);

    } finally {
        gateway.close();
        client.close();
    }

    return result
}


async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function newSigner(): Promise<Signer> {
    const files = await fs.readdir(keyDirectoryPath);
    const keyPath = path.resolve(keyDirectoryPath, files[0]);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certPath:          ${certPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}