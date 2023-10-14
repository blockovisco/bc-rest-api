import axios from "axios";
import {  blockchainAddEnergyToAsset, blockchainCreateEnergyAsset, blockchainCreateEcoin, blockchainCreateSellOffer, blockchainCreateBuyOffer, blockchainGetMasterNodeAsset } from "../blockchain/chaincode";
import { apiUrl, latitude, longtitude, frequencySec, maximumProduingValue, weatherApiKey, maxPrice, minPrice } from "./producing_config";
import { getConsume } from "./consume_data";
import { peerHostAlias } from "../config";

export const updateProducerAssetRoutine = async () => {

    const powerUsage: number = await getConsume();

    const cloudCoverage: number = await getCloudCoverage();

    const energyProducing = (1 - cloudCoverage/100) * maximumProduingValue;
    console.log("Energy from solar panels: " + energyProducing);
    console.log("Power usage: " + powerUsage);

    const energySurplus = energyProducing - powerUsage;

    console.log("Energy surplus: " + energySurplus);

    // blockchainUpdateProducerAsset(energySurplus);
    if(energySurplus > 0) {
        await blockchainAddEnergyToAsset(energySurplus);
        await blockchainCreateSellOffer(energySurplus, minPrice);
    }
    else if(energySurplus < 0) {
        await blockchainCreateBuyOffer(-energySurplus, maxPrice);
    }

    const refreshTime = frequencySec * 1000;
    setTimeout(updateProducerAssetRoutine, refreshTime);
}

export const checkIfMasterNodeExists = async () => {
    const result = await blockchainGetMasterNodeAsset();

    if(result.who == false) {
        console.log("Currently there is no master node! You are becoming one...")
    } else {
        console.log(result)
    }
}

export const assertEnergyAssetExists = async () => {
    const result = await blockchainCreateEnergyAsset();
    console.log("Energy asset assetion:\n");
    console.log(result)
}

export const assertEcoinAssetExists = async () => {
    const result = await blockchainCreateEcoin('1000');
    console.log("Energy asset assetion:\n");
    console.log(result)
}

const getCloudCoverage = async (): Promise<number> => {
    var result = 50;
    await axios.get(apiUrl + `?key=${weatherApiKey}&q=${latitude},${longtitude}`)
        .then(res => {
            const currentWeather = res.data.current;
            const isDay = currentWeather.is_day;
            const cloudCoverage: number = currentWeather.cloud;
            
            result = isDay ? cloudCoverage : 1;
        })
        .catch((e) => {
            console.log("Failed to fetch weather data:\n" + e);
            console.log("\nDefaulting to 50% cloud coverage...");
        })
    
    return result;
}