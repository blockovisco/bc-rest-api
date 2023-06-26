import { blockchainGetEcoinsOf, blockchainGetPeerContract, blockchainReadAsset } from "../blockchain/chaincode"
import { peerHostAlias } from "../config";

export const executeTranfer = async () => {
    const peerContractsObject = await blockchainGetPeerContract();
    const peerContracts = JSON.parse(JSON.stringify(peerContractsObject));
    const offers = peerContracts.Contracts;

    offers.forEach(async (offerId: string) => {
        const offer = JSON.parse(await blockchainReadAsset(offerId));
        
        const producer = offer.Offerer;

        const producerAsset = JSON.parse(await blockchainReadAsset('producer:'+producer))

        const amountToTransfer = producerAsset.Producing < offer.maxAmount ? producerAsset.Producing : offer.maxAmount;

        // check if the transfer is possible (enough ecoin)
        const userEcoins = await blockchainGetEcoinsOf(peerHostAlias)

        const oneTransferCost = amountToTransfer * offer.Price;

        console.log('user ma '+ userEcoins)
        console.log('koszt '+oneTransferCost)

    });
} 