'use client'

import { likeTweet } from '@/lib/actions/tweetActions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import HeartIconEmpty from '../icons/heartEmpty'
import HeartIconFilled from '../icons/heartFilled'
import { useOptimistic } from 'react'

type Props = {
  tweetId: string
  liked: boolean
  count: number
  showLikeCount?: boolean
}

const LikeButton = ({ tweetId, liked, count, showLikeCount = true }: Props) => {
  const pathname = usePathname()
  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { liked: liked, number: count },
    (state) => ({
      liked: !state.liked,
      number: state.liked ? state.number - 1 : state.number + 1,
    })
  )
  return (
    <Button
      onClick={async () => {
        addOptimisticLike({ liked: liked, number: count })
        await likeTweet(tweetId, pathname)
      }}
      className='!bg-black !p-0 h-5'
    >
      {optimisticLike.liked ? (
        <div className='flex items-center space-x-1 text-pink-600'>
          <HeartIconFilled />
          {showLikeCount ? <span>{optimisticLike.number}</span> : null}
        </div>
      ) : (
        <div className='group flex items-center space-x-1'>
          <HeartIconEmpty className='text-white/50 bg-black group-hover:text-pink-500' />
          {optimisticLike.number > 0 && showLikeCount && (
            <span className='text-white/80 group-hover:text-pink-500 ml-1'>
              {optimisticLike.number}
            </span>
          )}
        </div>
      )}
    </Button>
  )
}

export default LikeButton
