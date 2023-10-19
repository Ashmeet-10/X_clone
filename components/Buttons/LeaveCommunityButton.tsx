'use client'

import { joinOrLeaveCommunity } from '@/lib/actions/communityActions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const LeaveCommunityButton = ({ communityId }: { communityId: string }) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => joinOrLeaveCommunity(communityId, pathname)}
      className='rounded-full w-full font-bold py-6'
    >
      Leave
    </Button>
  )
}

export default LeaveCommunityButton
