import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

const UsersLiked = async ({ params }: { params: { id: string } }) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const currentUserInfoPromise = User.findOne({ id: currentUserData.id }).select('following')
  const tweetInfo = Tweet.findById(params.id).select('likes').populate('likes')
  const [user, tweet] = await Promise.all([currentUserInfoPromise, tweetInfo])
  return (
    <>
      {tweet.likes.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No likes yet</h1>
          <p className='text-white/50 mt-4'>
            When someone taps the heart to Like this post, it'll show up here.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          <UsersList users={tweet.likes} currentUser={user} />
        </div>
      )}
    </>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Liked by</span>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <UsersLiked params={params} />
      </Suspense>
    </>
  )
}

export default page
