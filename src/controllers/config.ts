import { NextFunction, Request, Response } from "express"
import { join } from "path"
// const fs = require('fs')
import fs from 'fs'
import path from "path"

const minPriceFileDir = "./files/minPrice.txt"
const maxPriceFileDir = "./files/maxPrice.txt"

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

    const maxPrice = fs.readFileSync(path.resolve(maxPriceFileDir), 'utf8')

    return res.status(200).json({ "maxPrice": maxPrice.toString() })
}

const getMinPrice = async (req: Request, res: Response, next: NextFunction) => {

    const minPrice = fs.readFileSync(path.resolve(minPriceFileDir), 'utf8')

    return res.status(200).json({ "minPrice": minPrice.toString() })
}

export default { saveMaxPrice, saveMinPrice, getMaxPrice, getMinPrice }