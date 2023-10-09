import { frequencySec } from "./producing_config";

const hWattDevices = 3;
const mWattDevices = 2;
const lWattDevices = 4;
const baseUse = 100;
const secondsInDay = 86_400;
const minutesToFrequency = 1;//60/frequencySec;
const numberOfPeriods = 100;

interface Period {
    start: number;
    end: number;
}

interface Devices {
    time: Period;
    watts: number;
}

export const getConsume = async () => {
    let watts = baseUse;
    let now = getTime();
    for(var device of devices) {
        if(device.time.end > now && now >= device.time.start){
            watts+= device.watts;
        }
    }
    return watts;
}

const fillDevices = () => {
    let devicesArray: Devices[] = [];
    let now = getTime();
    let start = 0;
    let length = 0;
    let watts = 0;
    for( let i = 0; i< hWattDevices + mWattDevices + lWattDevices; i++) {
        start = getRandomBetween(now-Math.floor(numberOfPeriods/4), now+numberOfPeriods);
        if(i/hWattDevices < 1){
            watts = 2000;
            length = minutesToFrequency * getRandomBetween(5, 40);
        }
        else if(i/(hWattDevices+mWattDevices) < 1){
            watts = 100 * getRandomBetween(5, 12);
            length = minutesToFrequency * getRandomBetween(10, 60);
        }
        else {
            watts = 10 * getRandomBetween(6, 12);
            length = minutesToFrequency * getRandomBetween(60, 360);
        }
        devicesArray.push({time: {start:start, end:start+length}, watts:watts})
    }
    return devicesArray;
}

const getRandomBetween = (left: number, right: number) => {
    return left + Math.floor(Math.random() * (right - left + 1));
}

const getTime = () => {
    const date: Date = new Date();
    return Math.floor((date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds())/frequencySec);
}

const devices: Devices[] = fillDevices();
