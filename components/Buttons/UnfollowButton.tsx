'use client'

import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { followOrUnfollowUser } from '@/lib/actions/userActions'

type Props = {
  userId: string
}

const UnfollowButton = ({ userId }: Props) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => followOrUnfollowUser(userId, pathname)}
      className='w-full rounded-full font-bold'
    >
      Unfollow
    </Button>
  )
}

export default UnfollowButton
