import { isMasterNode, masterNodeRoutineTime } from "../config"

export const masterNodeRoutine = () => {
    if(isMasterNode == false) {
        console.log("Tried to invoke masterNodeRoutine, but you are no longer a master node!");
        return;
    }

    console.log("Doing master node work...")

    setTimeout(masterNodeRoutine, masterNodeRoutineTime);
}