/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { Asset } from './asset';

const channelName = 'mychannel';
const chaincodeName = 'mysc'
const mspId = 'Org2MSP'
const appOrg = 'org2.example.com'

// Path to crypto materials.
const cryptoPath = path.resolve(__dirname, '..', '..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', appOrg);

// Path to user private key directory.
const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'keystore');

// Path to user certificate.
const certPath = path.resolve(cryptoPath, 'users', 'User1@' + appOrg, 'msp', 'signcerts', 'cert.pem');

// Path to peer tls certificate.
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.' + appOrg, 'tls', 'ca.crt');

// Gateway peer endpoint.
const peerEndpoint = 'localhost:9051';

// Gateway peer SSL host name override.
const peerHostAlias = 'peer0.' + appOrg;

const utf8Decoder = new TextDecoder();


export const blockchainGetAllAssets = async () => {
    return await connectAndExecute(getAllAssets, []);
}

export const blockchainInit = async () => {
    await connectAndExecute(initLedger, []);
}

export const blockchainCreateEnergy = async (amount: string) => {
    return await connectAndExecute(createEnergyAsset, [amount, peerHostAlias])
}

export const blockchainCreateEcoin = async (amount: string) => {
    return await connectAndExecute(createEcoinAsset, [amount, peerHostAlias])
}

export const blockchainCreateOffer = async(price: number, amount: number) => {
    return await connectAndExecute(createOffer, [price.toString(), amount.toString(), peerHostAlias])
}

export const blockchainAssetExists = async(id: string) => {
    return await connectAndExecute(assetExists, [id])
}

export const blockchainGetAllOffers = async () => {
    return await connectAndExecute(getAllOffers, []);
}

export const blockchainGetEcoinsOf = async(user: string) => {
    return await connectAndExecute(getEcoinsOfUser, [user])
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
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(contract: Contract, args: Array<string>): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllAssets(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', '' ,'');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

async function getEcoinsOfUser(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', 'ec' ,'ed');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);

    var ecoinsOf = result.filter(function(a: Asset){
        return a.owner == args[0]
    })

    return ecoinsOf;
}

async function getAllOffers(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', 'o' ,'p');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

async function createOffer(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateOffers, function creates and offer');

    const offerId = `offer${Date.now()}`;
    const resultBytes = await contract.submitTransaction(
        'CreateOffer',
        offerId,
        args[0],
        args[1],
        args[2]
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

async function assetExists(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: Check if asset exists');

    const resultBytes = await contract.evaluateTransaction('AssetExists', args[0]);
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}



/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function createEnergyAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateAsset, energy, owner: ' + args[1] + ' amount: ', args[0]);

    const assetId = `energy${Date.now()}`;
    await contract.submitTransaction(
        'CreateAsset',
        assetId,
        'energy',
        args[0],
        args[1]
    );

    let res = '{ "ID": "'+assetId+'", "Name": "energy", "Amount:": "' + args[0] + '", "Owner": "' + args[1] + '" }'
    console.log('*** Transaction committed successfully:');
    console.log(res)

    const result = JSON.parse(res)

    return result
}

async function createEcoinAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateAsset, ecoin, owner: ' + args[1] + ' amount: ', args[0]);

    const assetId = `ecoin${Date.now()}`;
    await contract.submitTransaction(
        'CreateAsset',
        assetId,
        'ecoin',
        args[0],
        args[1]
    );

    let res = '{ "ID": "'+assetId+'", "Name": "ecoin", "Amount:": "' + args[0] + '", "Owner": "' + args[1] + '" }'
    console.log('*** Transaction committed successfully:');
    console.log(res)

    const result = JSON.parse(res)

    return result
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
async function transferAssetAsync(contract: Contract): Promise<void> {
    console.log('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');

    const commit = await contract.submitAsync('TransferAsset', {
        arguments: ['assetId', 'Saptha'],
    });
    const oldOwner = utf8Decoder.decode(commit.getResult());

    console.log(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`);
    console.log('*** Waiting for transaction commit');

    const status = await commit.getStatus();
    if (!status.successful) {
        throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
    }

    console.log('*** Transaction committed successfully');
}

async function readAssetByID(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset', 'assetId');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
async function updateNonExistentAsset(contract: Contract): Promise<void>{
    console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');

    try {
        await contract.submitTransaction(
            'UpdateAsset',
            'asset70',
            'blue',
            '5',
            'Tomoko',
            '300',
        );
        console.log('******** FAILED to return an error');
    } catch (error) {
        console.log('*** Successfully caught the error: \n', error);
    }
}

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
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