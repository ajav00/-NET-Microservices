import EmptyFilter from '@/app/components/EmptyFilter'
import React from 'react'

export default async function SigIn({searchParams}: {searchParams: Promise<{callbackUrl: string}>}) {
  const {callbackUrl} = await searchParams ;

  return (
    <div>
      <EmptyFilter 
        title='You need to be signed in to view this page'
        subtitle='Please sign in to continue'
        showLogin 
        callbackUrl={callbackUrl} />
    </div>
  )
}
