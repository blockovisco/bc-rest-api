import { Contract } from '@hyperledger/fabric-gateway';
import { TextDecoder } from 'util';
import { peerHostAlias } from '../config';
import { Asset } from './asset';
import { blockchainCreateEcoin} from './chaincode';

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
    console.log('\n--> Evaluate Transaction: GetEcoinsOfUser: ' + args[0]);

    const resultBytes = await contract.evaluateTransaction('GetEcoinsOf', args[0]);

    const resultJson = utf8Decoder.decode(resultBytes);
    console.log(resultJson)

    return JSON.parse(resultJson)
}

export async function getPeerContract(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: GetPeerContract');

    const peerHostAlias = args[0];

    const resultBytes = await contract.submitTransaction('GetPeerContract', peerHostAlias);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);

    return result;
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

export async function createSellOffer(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateSellOffer, function creates and offer');

    // const currentEnergy = await getEnergyOfUser(contract, [peerHostAlias]);
    // await new Promise(f => setTimeout(f, 1000));
    // if(JSON.parse(JSON.stringify(currentEnergy))[0].Amount < args[0]) {
    //     return JSON.parse(
    //         `{
    //             "error": "This user doesn't have enough energy produced"
    //         }`)
    // }

    const offerId = `offer${Date.now()}`;
    const resultBytes = await contract.submitTransaction(
        'CreateOffer',
        offerId,
        args[0], // amount
        args[1], // price
        args[2],  // peerHostAlias
        "sell"
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createBuyOffer(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateBuyOffer, function creates and offer');
    // const currentEcoins = await getEcoinsOfUser(contract, [peerHostAlias]);
    // await new Promise(f => setTimeout(f, 1000));
    // if(JSON.parse(JSON.stringify(currentEcoins))[0].Amount < Number(args[0])*Number(args[1])) {
    //     return JSON.parse(
    //         `{
    //             "error": "This user doesn't have enough ecoins"
    //         }`)
    // }

    const offerId = `offer${Date.now()}`;
    const resultBytes = await contract.submitTransaction(
        'CreateOffer',
        offerId,
        args[0], // amount
        args[1], // price
        args[2],  // peerHostAlias
        "buy"
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

/**contracts.createPeerContract, [peerHostAlias]
contracts.addPeerContract, [contractId, peerHostAlias] */

export async function addPeerContract(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: AddPeerContract');
    const peerHostAlias = args[0]
    const offerId = args[1]
    const peerContractId = 'peerContract:' + peerHostAlias
    const resultBytes = await contract.submitTransaction(
        'AddPeerContract',
        peerContractId,
        offerId
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createPeerContract(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreatePeerContract');
    const peerHostAlias = args[0]
    const peerContractId = 'peerContract:' + peerHostAlias;
    const resultBytes = await contract.submitTransaction(
        'CreatePeerContract',
        peerContractId,
        peerHostAlias
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createContract(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: CreateContract');
    const contractId = `contract${Date.now()}`;
    const offerId = args[0]
    const peerHostAlias = args[1]

    const offer = await readAssetByID(contract, [offerId]);
    const offerJson = JSON.parse(offer)

    const producerAssetId = "producer:" + offerJson.Offerer;
    const consumerAssetId = "consumer:" + peerHostAlias;

    const resultBytes = await contract.submitTransaction(
        'CreateContract',
        contractId,
        producerAssetId,
        consumerAssetId,
        offerJson.effectiveDate,
        String(offerJson.Price),
        String(offerJson.maxAmount),
        "0"
    )

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

export async function addEcoin(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: AddEcoin, ecoin, owner: ' + args[1] + ' amount: ', args[0]);

    const resultBytes = await contract.submitTransaction(
        'AddEcoin',
        args[0],
        args[1]
    );

    console.log('*** Transaction committed successfully:');

    const resultJson = utf8Decoder.decode(resultBytes);
    return JSON.parse(resultJson);
}

export async function selectOffers(contract: Contract, args: Array<string>): Promise<void> {

    //skopiowane z getallofers
    console.log('\n--> Evaluate Transaction: selectOffers, function selects and execute all buy nad sell offers');
    await contract.submitTransaction(
        'SelectOffers'
    );
    //console.log(JSON.parse(result));
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

export async function readAssetByID(contract: Contract, args: Array<string>): Promise<string> {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');
    const assetId = args[0];
    const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return resultJson;
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

export async function executeOffer(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: ExecuteOffer');
    const peerHostAlias = args[0]
    const offerId = args[1]
    const resultBytes = await contract.submitTransaction(
        'ExecuteOffer',
        peerHostAlias,
        offerId
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function getMasterNodeAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Evaluate Transaction: Get Master Node Asset');
    const resultBytes = await contract.evaluateTransaction(
        'GetMasterNodeAsset'
    );
    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

export async function createMasterNodeAsset(contract: Contract, args: Array<string>): Promise<JSON> {
    console.log('\n--> Submit Transaction: Create Master Node Asset');
    const peerHostAlias = args[0]

    const resultBytes = await contract.submitTransaction(
        'CreateMasterNodeAsset',
        peerHostAlias
    );

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    return result
}

/*
export async function updateEnergyAsset(contract: Contract, args: Array<string>) {
    console.log('\n--> Submit Transaction: updateEnergyAsset, energy, owner: ' + args[1] + ' amount: ', args[0]);

    const assetId = `energy:${args[1]}`

    await contract.submitTransaction(
        `UpdateEnergyAsset`,
        assetId,
        args[0]
    )
}
*/ 