'use client'

import { Repeat } from 'lucide-react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import { repostTweet } from '@/lib/actions/tweetActions'

type Props = {
  tweetId: string
  reposted: boolean
}

const RepostButton = ({ tweetId, reposted }: Props) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => repostTweet(tweetId, pathname)}
      className='!bg-black !p-0 h-5'
    >
      {reposted ? (
        <Repeat className='bg-black text-green-500 h-5 w-5' />
      ) : (
        <Repeat className='text-white/50 bg-black hover:text-green-500 h-5 w-5' />
      )}
    </Button>
  )
}

export default RepostButton
