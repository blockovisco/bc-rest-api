import path from "path"
import fs from 'fs'

export const minPriceFileDir = "./files/minPrice.txt"
export const maxPriceFileDir = "./files/maxPrice.txt"

export const readMinPrice = () => {
    const res = fs.readFileSync(path.resolve(minPriceFileDir), {encoding: 'utf8', flag: 'r'});
    console.log(res);
    return res;
}

export const readMaxPrice = () => {
    return fs.readFileSync(path.resolve(maxPriceFileDir), 'utf8');
}