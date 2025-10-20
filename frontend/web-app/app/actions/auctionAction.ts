'use server'

import { auth } from '@/auth';
import { Auction, PagedResult } from '@/types'
import { fetchWrapper } from '../lib/fetchWrapper';
import { FieldValues } from 'react-hook-form';


export async function getData(query: string): Promise<PagedResult<Auction>>{
    return fetchWrapper.get(`search${query}`);
}


export async function updateAuctionTest(): Promise<{status: number, message: string}>{
  const data = {
    mileage: Math.floor(Math.random() * 100000)+1
  }

  return fetchWrapper.put('update/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
}

export async function createAuction(data: FieldValues){
  return fetchWrapper.put(`auctions`, data);
}

export async function getDetailedViewData(id: string): Promise<Auction>{
  return fetchWrapper.get(`auctions/${id}`);
}

export async function updateAuction(id: string, data: FieldValues) {
  return fetchWrapper.put(`auctions/${id}`, data);
}

export async function deleteAuction(id: string) {
  return fetchWrapper.del(`auctions/${id}`);
}