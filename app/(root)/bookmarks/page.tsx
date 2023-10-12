import BackButton from '@/components/BackButton'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchUser } from '@/lib/actions/userActions'
import { currentUser } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

const FetchData = async () => {
  const currentuser = await currentUser()
  if (!currentuser) return null
  const currentUserInfo = await fetchUser(currentuser.id)
  await currentUserInfo.populate({
    path: 'bookmarked',
    populate: {
      path: 'author',
    },
  })
  return (
    <div>
      {currentUserInfo.bookmarked.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>Save posts for later</h1>
          <p className='text-white/50 mt-4'>
            Bookmark posts to easily find them again in the future.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          <TweetsList tweets={currentUserInfo.bookmarked} />
        </div>
      )}
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
      <Suspense
        fallback={<Loading className='min-h-[90vh] items-start mt-4' />}
      >
        <FetchData />
      </Suspense>
    </div>
  )
}

export default page
