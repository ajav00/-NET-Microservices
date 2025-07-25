'use client'

import { useParamStore } from '@/hooks/useParamStore'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export const Search = () => {
  const serParams = useParamStore(state => state.setParams);
  const setSearchValue = useParamStore(state => state.setSearchValue);
  const searchValue = useParamStore(state => state.searchValue);
  
  function onChange(event: any) {
    setSearchValue(event.target.value);
  }

  function search(){
    serParams({searchTerm:searchValue});
  }


  return (
    <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
      <input
        onKeyDown={(e:any) => {
          if(e.key === 'Enter') search()
        }}
        value={searchValue}
        onChange={onChange}
        type="text" placeholder='Search for cars ny make, model or color'
        className='flex-grow pl-5 bg-transparent focus:outline-none border-transparent focus:ring-0 text-sm text-gray-600'
      />
      <button onClick={search}>
        <FaSearch size={34} className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2' />
      </button>
    </div>
  )
}
