'use server'

import { Quote } from "@/interfaces"
import prisma from "@/lib/prisma"
import { getProductById } from "../products/get-product-by-id"

export interface QuoteDetail {
    id: string;
    quote_id: string; 
    product_id: string;  
    quantity: number;
    unit_price: number;
}

export const getQuoteById = async (id: string) : Promise<Quote> => {
    try {

        const quote = await prisma.quotes.findFirst({
            where:{ id }
        })

        if (!quote) {
            throw new Error ('Ocurrio un problema al buscar el presupuesto')
        }

        const quoteDetails = await prisma.quote_Details.findMany({
            where:{quote_id: id}
        })

        if (!quoteDetails) {
            return {
                ...quote,
                details: []
            }
        }

        const quoteDetailsWithProduct = await Promise.all(
            quoteDetails.map(async (qd: QuoteDetail) => {
                const product = await getProductById(qd.product_id);
                return {
                    ...qd,
                    product
                };
            })
        );

        return {
            ...quote,
            details: quoteDetailsWithProduct
        }

    } catch (error) {
        console.log(error)
        throw new Error ('No se pudo obtener el presupuesto por slug') 
    }
}