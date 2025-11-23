'use client'


import { useParamStore } from '@/hooks/useParamStore'
import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-react'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai'
import { HiCog, HiUser } from 'react-icons/hi'

type Props = {
  user: User
}

export default function UserActions ({ user } : Props) {
  const setParams = useParamStore((state) => state.setParams);

  function setWinner() {
    setParams({ winner: user.username!, seller: undefined })
  }

  function setSeller() {
    setParams({ seller: user.username!, winner: undefined })
  }

  return (
    <Dropdown label={`Welcome ${user.name}`} inline className='cursor-pointer'>
      <DropdownItem icon={HiUser} onClick={setSeller}>
        My Auctions
      </DropdownItem>
      <DropdownItem icon={AiFillTrophy} onClick={setWinner}>
        Auctions won
      </DropdownItem>
      <DropdownItem icon={AiFillCar}>
        <Link href={'/auctions/create'}>
          Sell my car
        </Link>
      </DropdownItem>
      <DropdownItem icon={HiCog}>
        <Link href="/session">
          Session (dev only)
        </Link>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem icon={AiOutlineLogout} onClick={() => signOut({redirectTo: '/'})}>
        Sign out
      </DropdownItem>
    </Dropdown>
  )
}


