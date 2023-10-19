'use client'

import { deleteTweet } from '@/lib/actions/tweetActions'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const DeleteTweetButton = ({ tweetId }: { tweetId: string }) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => deleteTweet(tweetId, pathname)}
      className='rounded-full !bg-red-600 !text-white w-full font-bold py-6'
    >
      Delete
    </Button>
  )
}

export default DeleteTweetButton
