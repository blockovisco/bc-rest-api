import { NextFunction, Request, Response } from "express"
import { promises as fsPromise } from "fs"

const minPriceFileDir = "../files/minPrice.txt"
const maxPriceFileDir = "../files/maxPrice.txt"

const saveMaxPrice = async (req: Request, res: Response, next: NextFunction) => {
    const maxPrice = req.params.maxPrice;
    let result = 204;

    await fsPromise.writeFile(maxPriceFileDir, maxPrice, { flag: "w" }
    ).catch((err) => {
        console.log(err)
        result = 500;
    })

    return res.status(result);
}

const saveMinPrice = async (req: Request, res: Response, next: NextFunction) => {
    const maxPrice = req.params.minPrice;
    let result = 204;

    await fsPromise.writeFile(minPriceFileDir, maxPrice, { flag: "w" }
    ).catch((err) => {
        console.log(err)
        result = 500;
    })

    return res.status(result);
}


const getMaxPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const maxPrice = await fsPromise.readFile(maxPriceFileDir).then(res => res.toString());
        return res.status(200).json({ maxPrice: maxPrice })
    }
    catch (err) {
        console.log(err)
        return res.status(400)
    }
}

const getMinPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const minPrice = await fsPromise.readFile(minPriceFileDir).then(res => res.toString());
        return res.status(200).json({ minPrice: minPrice })
    }
    catch (err) {
        console.log(err)
        return res.status(400)
    }
}

export default { saveMaxPrice, saveMinPrice, getMaxPrice, getMinPrice }