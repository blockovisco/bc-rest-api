import { isMasterNode, masterNodeRoutineTime } from "../config"
import { blockchainSelectOffers } from "../blockchain/chaincode";
export const masterNodeRoutine = async () => {
    if(isMasterNode === false) {
        console.log("Tried to invoke masterNodeRoutine, but you are no longer a master node!");
        return;
    }

    await blockchainSelectOffers()

    console.log("Doing master node work...")

    setTimeout(masterNodeRoutine, masterNodeRoutineTime);
}