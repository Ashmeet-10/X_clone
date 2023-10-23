import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

const FetchData = async () => {
  const currentuser = await currentUser()
  if (!currentuser) return null
  const currentUserInfo = await User.findOne({ id: currentuser.id })
    .select('bookmarked')
    .populate({
      path: 'bookmarked',
      populate: [
        {
          path: 'author',
          select: 'name username image id following followers bio',
        },
        {
          path: 'quotedTweetId',
          populate: {
            path: 'author',
            select: 'image name username',
          },
        },
      ],
    })
  if (currentUserInfo.bookmarked.length === 0) {
    return (
      <div className='m-8'>
        <h1 className='text-4xl font-bold'>Save posts for later</h1>
        <p className='text-white/50 mt-4'>
          Bookmark posts to easily find them again in the future.
        </p>
      </div>
    )
  }

  return (
    <div className='my-4'>
      <TweetsList tweets={currentUserInfo.bookmarked} />
    </div>
  )
}

const page = () => {
  return (
    <div>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Bookmarks</span>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <FetchData />
      </Suspense>
    </div>
  )
}

export default page
