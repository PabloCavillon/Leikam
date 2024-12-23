'use server'

import { Quote } from "@/interfaces"
import prisma from "@/lib/prisma"
import { getProductById } from "../products/get-product-by-id"

export const getQuoteBySlug = async (slug: string) : Promise<Quote> => {
    try {

        const quote = await prisma.quotes.findFirst({
            where:{slug}
        })

        if (!quote) {
            throw new Error ('Ocurrio un problema al buscar el presupuesto')
        }

        const quoteDetails = await prisma.quote_Details.findMany({
            where:{quote_id: quote.id}
        })

        if (!quoteDetails) {
            return {
                ...quote,
                details: []
            }
        }

        const quoteDetailsWithProduct = await Promise.all(
            quoteDetails.map(async item => {
                const product = await getProductById(item.product_id);
                return {
                    ...item,
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