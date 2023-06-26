import axios from "axios";
import { blockchainCreateProducerAsset, blockchainUpdateProducerAsset } from "../blockchain/chaincode";
import { apiUrl, latitude, longtitude, maximumProduingValue, weatherApiKey } from "./producing_config";

export const updateProducerAssetRoutine = async () => {
    const cloudCoverage: number = await getCloudCoverage();

    const energyProducing = (1 - cloudCoverage) * maximumProduingValue;
    console.log("Updated producing energy: " + energyProducing);

    blockchainUpdateProducerAsset(energyProducing);


    const refreshTime = 5 * 60 * 1000;
    setTimeout(updateProducerAssetRoutine, refreshTime);
}

export const assertProducerAssetExists = async () => {
    const result = await blockchainCreateProducerAsset(latitude, longtitude);
    console.log("Producer asset assetion:\n");
    console.log(result)
}

const getCloudCoverage = async (): Promise<number> => {
    var result = 0.5;
    await axios.get(apiUrl + `?key=${weatherApiKey}&q=${latitude},${longtitude}`)
        .then(res => {
            const currentWeather = res.data.current;
            const isDay = currentWeather.is_day;
            const cloudCoverage: number = currentWeather.cloud;
            result = cloudCoverage * isDay;
        })
        .catch((e) => {
            console.log("Failed to fetch weather data:\n" + e);
            console.log("\nDefaulting to 0.5 cloud coverage...");
        })
    
    return result;
}