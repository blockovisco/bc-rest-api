import { NextFunction, Request, Response } from "express"
import { join } from "path"
// const fs = require('fs')
import fs from 'fs'
import path from "path"
import { maxPriceFileDir, minPriceFileDir, readMaxPrice, readMinPrice } from "../services/price_service"
import { readConsumedEnergy, readProducedEnergy } from "../services/energy_service"

const saveMaxPrice = async (req: Request, res: Response, next: NextFunction) => {
    const maxPrice = req.params.maxPrice;


    fs.writeFileSync(path.resolve(maxPriceFileDir), maxPrice, { flag: "w" })

    return res.status(200).json({ maxPrice: maxPrice })

}

const saveMinPrice = async (req: Request, res: Response, next: NextFunction) => {

    const minPrice = req.params.minPrice;
    await fs.writeFile(path.resolve(minPriceFileDir), minPrice, (err) => {
        if (err) {
            console.error(err);
        }
        return;
    })

    return res.status(200).json({ minPrice: minPrice })

}


const getMaxPrice = async (req: Request, res: Response, next: NextFunction) => {

    const maxPrice = readMaxPrice();

    return res.status(200).json({ "maxPrice": maxPrice.toString() })
}

const getMinPrice = async (req: Request, res: Response, next: NextFunction) => {

    const minPrice = readMinPrice();

    return res.status(200).json({ "minPrice": minPrice.toString() })
}

const getConsumedEnergy = async (req: Request, res: Response, next: NextFunction) => {
    const consumedEnergy = readConsumedEnergy();

    return res.status(200).json({ "consumedEnergy": consumedEnergy.toString() })
}

const getProducedEnergy = async (req: Request, res: Response, next: NextFunction) => {
    const producedEnergy = readProducedEnergy();

    return res.status(200).json({ "producedEnergy": producedEnergy.toString() })
}

export default { saveMaxPrice, saveMinPrice, getMaxPrice, getMinPrice, getConsumedEnergy, getProducedEnergy }