'use client'

import React, { useEffect, useState } from 'react'
import { formatNumber, formatDate } from '@/util'
import { redirect } from 'next/navigation'
import { Quote } from '@/interfaces'
import Link from 'next/link'
import { cancelQuote } from '@/actions'

interface Props {
    quotes: Quote[]
}
export type State = 'Pendient' | 'Accepted' | 'Canceled';

const translate = {
    'Pendient': 'Pendiente',
    'Accepted': 'Aceptado',
    'Canceled': 'Cancelado'
};

export default function TableQuotes ({quotes}: Props) {
    
    const [quotesState, setQuoteState] = useState(quotes);

    const [, setQuoteToEdit] = useState({});


    const handleClickEdit = (quote: Quote) => {
        setQuoteToEdit(quote);
        redirect(`/quote`);
    }


    const handleClickCreateWorkOrder = (slug: string) => {
        redirect(`/workOrder/${slug}`)
    }

    const handleClickCancel = async (id: string) => {
        const quoteCanceled = await cancelQuote(id);
        setQuoteState(await Promise.all(quotesState.map(q => {
            if (q.id === id) return quoteCanceled
            return q;
        })))
    }

    useEffect(() => {
    }, [quotesState])
    
    return(
        <div className='w-full flex justify-center p-4'>
            <table className='w-10/12'>
                <thead>
                    <tr className='bg-custom-gray text-gray-400 '>
                        <th className='p-3'>Código</th>
                        <th className='p-3'>Estado</th>
                        <th className='p-3'>Fecha</th>
                        <th className='p-3'>Monto</th>
                        <th className='p-3 w-1/5'></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        quotesState.map(item => (
                            <tr 
                                key={item.slug} 
                                className='bg-custom-dark-gray text-gray-400 hover:bg-gray-400 hover:text-custom-dark-gray'
                            >
                                <td className='p-3 text-center'>
                                    <Link 
                                        href={`./quote/${item.slug}`}
                                        className='hover:text-blue-500 hover:underline font-bold'
                                    >
                                        {item.slug}
                                    </Link>
                                </td>
                                <td className='text-center flex flex-row gap-2 justify-center items-center p-2'>
                                    <span
                                        className={`
                                        inline-block w-3 h-3 rounded-full
                                        ${item.state === 'Pendient' ? 'bg-yellow-200' :
                                            item.state === 'Accepted' ? 'bg-green-200' :
                                            item.state === 'Canceled' ? 'bg-red-200' : 'bg-gray-400'}
                                        `}
                                    ></span>
                                     {translate[item.state]}
                                </td>
                                <td className='text-center'>{formatDate(item.creation_date.toString())}</td>
                                <td className='text-center'>$ {formatNumber(item.total_amount, 2)}</td>
                                <td className='text-center w-4/12'>
                                    <div className='flex flex-row justify-around gap-1 p-2'>
                                        <button onClick={() => handleClickEdit(item)} className='hover:text-blue-500 hover:underline'>Editar</button>
                                        <button onClick={() => handleClickCreateWorkOrder(item.slug)} className='hover:text-blue-500 hover:underline' type="button">Crear Orden</button>
                                        <button onClick={() => handleClickCancel(item.id)} className='hover:text-blue-500 hover:underline' type="button">Cancelar</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    ) 
}
