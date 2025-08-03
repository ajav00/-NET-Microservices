import EmptyFilter from '@/app/components/EmptyFilter'
import React from 'react'

export default function SigIn({searchParams}: {searchParams: {callbackUrl: string}}) {
  return (
    <div>
      <EmptyFilter 
        title='You need to be signed in to view this page'
        subtitle='Please sign in to continue'
        showLogin 
        callbackUrl={searchParams.callbackUrl} />
    </div>
  )
}
