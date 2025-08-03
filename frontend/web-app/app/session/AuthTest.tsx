'use client'

import React, { useState } from 'react'
import { updateAuctionTest } from '../actions/auctionAction';
import { Button, Spinner } from 'flowbite-react';

export default function AuthTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{status: number, message: string} | null>(null);
  
  function handleUpdate(){
    setResult(null);
    setLoading(true);
    updateAuctionTest()
      .then(res => setResult(res))
      .catch(err => setResult(err))
      .finally(() => setLoading(false));
  }

  return (
    <div className='flex items-center gap-4'>
      <Button onClick={handleUpdate}>
        {loading && <Spinner size='sm' className='me-3' />}
        Test auth
      </Button>
      <div>
        {JSON.stringify(result, null, 2)}
      </div>
    </div>
  )
}
