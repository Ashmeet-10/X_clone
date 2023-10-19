'use client'

import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { followOrUnfollowUser } from '@/lib/actions/userActions'
import { experimental_useOptimistic as useOptimistic } from 'react'

type Props = {
  userId: string
  followed: boolean
}

const FollowButton = ({ userId, followed }: Props) => {
  const pathname = usePathname()
  const [optimisticFollow, addOptimisticFollow] = useOptimistic(
    { followed: followed },
    (state) => ({
      followed: !state.followed,
    })
  )
  return (
    <>
      <Button
        onClick={() => {
          addOptimisticFollow({ followed: followed })
          followOrUnfollowUser(userId, pathname)
        }}
        className={`rounded-full font-bold ease-in-out duration-500 ${
          optimisticFollow.followed && '!border !bg-black !text-white'
        }`}
      >
        {optimisticFollow.followed ? 'Following' : 'Follow'}
      </Button>
    </>
  )
}

export default FollowButton
