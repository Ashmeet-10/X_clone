'use client'

import { likeTweet } from '@/lib/actions/tweetActions'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import HeartIconEmpty from './icons/heartEmpty'
import HeartIconFilled from './icons/heartFilled'

type Props = {
  tweetId: string
  liked: boolean
}

const LikeButton = ({ tweetId, liked }: Props) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => likeTweet(tweetId, pathname)}
      className='!bg-black !p-0 h-5'
    >
      {liked ? (
        <HeartIconFilled className='text-pink-600' />
      ) : (
        <HeartIconEmpty className='text-white/50 bg-black hover:text-pink-500' />
      )}
    </Button>
  )
}

export default LikeButton
