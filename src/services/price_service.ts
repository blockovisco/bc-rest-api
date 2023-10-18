import path from "path"
import fs from 'fs'

export const minPriceFileDir = "./files/minPrice.txt"
export const maxPriceFileDir = "./files/maxPrice.txt"

export const readMinPrice = () => {
    return fs.readFileSync(path.resolve(minPriceFileDir), 'utf8');
}

export const readMaxPrice = () => {
    return fs.readFileSync(path.resolve(maxPriceFileDir), 'utf8');
}