'use server'

import { ProductKit } from "@/interfaces";
import prisma from "@/lib/prisma";
import { getProductById } from "../products/get-product-by-id";

interface ProductKitData {
    id: string; 
    kit_id: string; 
    product_id: string; 
    quantity: number;
}

export const getAllProductKits = async (id: string) : Promise<ProductKit[]> => {
    try {
        const productKits = await prisma.products_Kits.findMany({
            where: {
                kit_id: id
            }
        });

        const productsUpdated = Promise.all(productKits.map(async (productKit: ProductKitData) => {
            const {product_id, ...rest} = productKit;
            const productData = await getProductById(product_id);

            return { ...rest, product: productData }
        }))

        return productsUpdated;

    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener los productos');
    }
}