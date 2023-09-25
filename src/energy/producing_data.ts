import axios from "axios";
import { blockchainCreateEnergy, blockchainCreateProducerAsset, blockchainUpdateEnergyAsset, blockchainUpdateProducerAsset, blockchainAddEnergyToAsset, blockchainCreateEnergyAsset } from "../blockchain/chaincode";
import { apiUrl, latitude, longtitude, maximumPowerUsage, maximumProduingValue, weatherApiKey } from "./producing_config";

export const updateProducerAssetRoutine = async () => {

    const powerUsage = maximumPowerUsage;

    const cloudCoverage: number = await getCloudCoverage();

    const energyProducing = (1 - cloudCoverage/100) * maximumProduingValue;
    console.log("Energy from solar panels: " + energyProducing);
    console.log("Power usage: " + powerUsage);

    const energySurplus = energyProducing - powerUsage > 0 ? energyProducing - powerUsage : 0.0;

    console.log("Energy surplus: " + energySurplus);

    blockchainUpdateProducerAsset(energySurplus);

    blockchainAddEnergyToAsset(energySurplus);

    const refreshTime = 5 * 60 * 1000;
    setTimeout(updateProducerAssetRoutine, refreshTime);
}

export const assertProducerAssetExists = async () => {
    const result = await blockchainCreateProducerAsset(latitude, longtitude);
    console.log("Producer asset assetion:\n");
    console.log(result)
}

export const assertEnergyAssetExists = async () => {
    const result = await blockchainCreateEnergyAsset();
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
            result = cloudCoverage * isDay;
        })
        .catch((e) => {
            console.log("Failed to fetch weather data:\n" + e);
            console.log("\nDefaulting to 50% cloud coverage...");
        })
    
    return result;
}