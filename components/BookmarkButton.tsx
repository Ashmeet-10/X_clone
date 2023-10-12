'use client'

import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import BookmarkedIcon from './icons/bookmarked'
import BookmarkIcon from './icons/bookmark'
import { bookmarkOrUnbookmarkTweet } from '@/lib/actions/tweetActions'

type Props = {
  tweetId: string
  bookmarked: boolean
}

const BookmarkButton = ({ tweetId, bookmarked }: Props) => {
  const pathname = usePathname()
  return (
    <Button
      onClick={() => bookmarkOrUnbookmarkTweet(tweetId, pathname)}
      className='!bg-black !p-0 h-5'
    >
      {bookmarked ? (
        <BookmarkedIcon className='text-sky-600' />
      ) : (
        <BookmarkIcon className='text-white/50 bg-black hover:text-sky-600' />
      )}
    </Button>
  )
}

export default BookmarkButton