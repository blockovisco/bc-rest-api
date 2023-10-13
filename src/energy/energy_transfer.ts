import { blockchainCreateEnergy, blockchainGetEcoinsOf, blockchainGetPeerContract, blockchainReadAsset, blockchainUnifyEcoinAsset } from "../blockchain/chaincode"
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

        if( userEcoins >= oneTransferCost) {
            // trasfer money and energy
            await blockchainUnifyEcoinAsset(peerHostAlias, String(-oneTransferCost));
            await blockchainUnifyEcoinAsset(producer, String(oneTransferCost));
            await blockchainCreateEnergy(String(amountToTransfer));

            console.log(`Energy trasferred from ${producer} to ${peerHostAlias} for $${oneTransferCost}.`)
        }
    });

    setTimeout(executeTranfer, 60 * 1000);
} 