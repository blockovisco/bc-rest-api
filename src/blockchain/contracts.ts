import { Contract } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { Asset } from './asset';
import { blockchainGetListOfEcoinsOf } from './chaincode';

const utf8Decoder = new TextDecoder();

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
 export async function initLedger(contract: Contract, args: Array<string>): Promise<void> {
    console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

    await contract.submitTransaction('InitLedger');

    console.log('*** Transaction committed successfully');
}

/**
 * Evaluate a transaction to query ledger state.
 */
 export async function getAllAssets(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', '' ,'');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

export async function getEcoinsOfUser(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', 'ec' ,'ed');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);

    var ecoinsOf = result.filter(function(a: Asset){
        return a.owner == args[0]
    })

    return ecoinsOf;
}

export async function getEnergyOfUser(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', 'en' ,'eo');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);

    var energyOf = result.filter(function(a: Asset){
        return a.owner == args[0]
    })

    return energyOf;
}

export async function getAllOffers(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAssetsByRange', 'o' ,'p');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}

export async function createProducerAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: createProducerAsset');
    
    console.log(args[0], args[1], args[2]);
    
    const resultBytes = await contract.submitTransaction(
        'CreateProducerAsset',
        args[0], //owner
        args[1], //latitude
        args[2] // longtitude
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createConsumerAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: createProducerAsset');
    
    console.log(args[0], args[1], args[2]);
    
    const resultBytes = await contract.submitTransaction(
        'CreateConsumerAsset',
        args[0], //owner
        args[1], //latitude
        args[2] // longtitude
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function updateProducerAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: updateProducerAsset -> '+args[0]+': '+args[1]);
    
    const resultBytes = await contract.submitTransaction(
        'UpdateProducerAsset',
        args[0],
        args[1]
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function updateConsumerAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: updateProducerAsset -> '+args[0]+': '+args[1]);
    
    const resultBytes = await contract.submitTransaction(
        'UpdateConsumerAsset',
        args[0],
        args[1]
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createOffer(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateOffers, function creates and offer');
    const offerId = `offer${Date.now()}`;
    const resultBytes = await contract.submitTransaction(
        'CreateOffer',
        offerId,
        args[0], // price
        args[1], // maxAmount
        args[2], // effectiveDate
        args[3]  // peerHostAlias
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function assetExists(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: Check if asset exists');

    const resultBytes = await contract.evaluateTransaction('AssetExists', args[0]);
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result;
}



/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
export async function createEnergyAsset(contract: Contract, args: Array<string>): Promise<JSON> {
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

export async function createEcoinAsset(contract: Contract, args: Array<string>): Promise<JSON> {
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

export async function getSumOfEcoinsOf(owner: string): Promise<number> {
    var result: Array<Asset> = await blockchainGetListOfEcoinsOf(owner)
    if(result == null || result.length == 0) return 0;
    var sum = result.map(asset => asset.amount).reduce((acc, amount) => acc + amount);
    return sum;
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
export async function transferAssetAsync(contract: Contract): Promise<void> {
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

export async function readAssetByID(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset', 'assetId');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
 export async function updateNonExistentAsset(contract: Contract): Promise<void>{
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
export function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}