'use client'

import React, { useEffect, useState } from 'react'
import { AuctionCard } from './AuctionCard';
import { Auction, PagedResult } from '@/types';
import { AppPagination } from '../components/AppPagination';
import { getData } from '../actions/auctionAction';
import { Filters } from './Filters';
import { useParamStore } from '@/hooks/useParamStore';
import { useShallow } from 'zustand/shallow';
import qs from 'query-string'
import EmptyFilter from '../components/EmptyFilter';


export default function Listings() {
    const [data, setData] = useState<PagedResult<Auction>>();
    const params = useParamStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy
    })))

    const setParams = useParamStore(state => state.setParams)
    const url = qs.stringifyUrl({ url: '', query: params });

    function setPageNumber(pageNumber: number){
        setParams({pageNumber: pageNumber});
    }

    useEffect(() => {
        getData(url).then(data => {
            setData(data)
        })
    }, [url]);

    if(!data) return <h3>Loading...</h3>

    return (
        <>
            <Filters />
            {data.toalCount === 0 ? (
                <EmptyFilter showReset />
            ): (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {data.results.map((auction) => (
                            <AuctionCard auction={auction} key={auction.id}/>
                        ))}
                    </div>
                    <div className='flex justify-center'>
                        <AppPagination 
                        pageChanged={setPageNumber}  
                        currentPage={params.pageNumber} 
                        pageCount={data.pageCount} />
                    </div>
                </>
            )}
        </>
        
  )
}
