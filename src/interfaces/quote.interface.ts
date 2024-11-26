import { Client } from "./client.interface";
import { QuoteDetail } from "./quoteDetail.interface";

export interface Quote {
    id: string; 
    client: Client; 
    creationDate: Date;
    totalAmount: number;
    dolarValue: number;
    products: QuoteDetail[];
}