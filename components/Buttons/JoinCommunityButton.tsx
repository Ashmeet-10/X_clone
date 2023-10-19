'use client'

import { joinOrLeaveCommunity } from '@/lib/actions/communityActions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const JoinCommunityButton = ({ communityId }: { communityId: string }) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => joinOrLeaveCommunity(communityId, pathname)}
      className='rounded-full w-full !bg-sky-500 !text-white font-bold hover:!bg-sky-600'
    >
      Agree and Join
    </Button>
  )
}

export default JoinCommunityButton
