import path from "path"
import fs from 'fs'

export const consumedEnergyFileDir = "./files/consumedEnergy.txt"
export const producedEnergyFileDir = "./files/producedEnergy.txt"

export const readConsumedEnergy = () => {
    return fs.readFileSync(path.resolve(consumedEnergyFileDir), 'utf8');
}

export const readProducedEnergy = () => {
    return fs.readFileSync(path.resolve(producedEnergyFileDir), 'utf8');
}

export const saveConsumedEnergy = (consumedEnergy: number) => {
    fs.writeFileSync(path.resolve(consumedEnergyFileDir), consumedEnergy.toString(), { flag: "w" })
}

export const saveProducedEnergy = (producedEnergy: number) => {
    fs.writeFileSync(path.resolve(producedEnergyFileDir), producedEnergy.toString(), { flag: "w" })
}