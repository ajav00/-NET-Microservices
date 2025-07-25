'use client'
import { useParamStore } from '@/hooks/useParamStore'
import React from 'react'
import { AiOutlineCar } from 'react-icons/ai'

export const Logo = () => {

    const reset = useParamStore(state => state.reset);

    return (
        <div onClick={reset} className='flex items-center gap-2 text-3xl font-semibold text-red-500'>
            <AiOutlineCar size={34} />
            <div>Carsties Auctions</div>
        </div>
    )
}
