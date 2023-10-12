'use client'

import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { followOrUnfollowUser } from '@/lib/actions/userActions'
import { useState } from 'react'

type Props = {
  userId: string
  followed: boolean
}

const FollowButton = ({ userId, followed }: Props) => {
  const [string, setString] = useState('Following')
  const pathname = usePathname()
  return (
    <>
      {!followed ? (
        <Button
          onClick={() => followOrUnfollowUser(userId, pathname)}
          className='rounded-full font-bold'
        >
          Follow
        </Button>
      ) : (
        <Button
          onClick={() => followOrUnfollowUser(userId, pathname)}
          onMouseEnter={() => setString('Unfollow')}
          onMouseLeave={() => setString('Following')}
          className='rounded-full font-bold border border-white hover:!text-red-500 hover:!border-red-500 !text-white !bg-black'
        >
          {string}
        </Button>
      )}
    </>
  )
}

export default FollowButton
