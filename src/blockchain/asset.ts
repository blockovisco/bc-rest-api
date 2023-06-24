export class Asset {
    ID: string;
    Name: string;
    amount: number;
    owner: string;
}

export class OfferContract {
    ID: string;
    From: string;
    To: number;
    EffectiveDate: string;
    Price: number;
    MaxAmount: number;
    EnergyLoss: number;
}