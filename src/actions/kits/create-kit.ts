'use server'

import { Product } from "@/interfaces";
import prisma from "@/lib/prisma";

interface productWithQuantity extends Product {
    quantity: number;
}

interface Props {
    name: string;
    price: number;
    expiration_date?: Date;
    products: productWithQuantity[];
}

export const createKit = async (data: Props) => {
    try {
        const {id: kitCreatedId} = await prisma.kits.create({
            data: {
                name: data.name,
                slug: data.name.toLowerCase().replace(/ /g, "-"),
                price: Number(data.price),
                expiration_date: data.expiration_date ? new Date(data.expiration_date) : null,
            },
            select: {
                id: true
            }
        })

        await Promise.all(data.products.map(async (product) => {
            await prisma.products_Kits.create({
                data: {
                    product_id: product.id,
                    kit_id: kitCreatedId,
                    quantity: product.quantity
                }
            })
        }))

        return {ok:true};

    } catch (error) {
        console.log(error)
        throw new Error ("Ocurrió un problema al crear el kit");
    }
}
