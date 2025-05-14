import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

const UsersReposted = async ({ params }: { params: { id: string } }) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const currentUserInfoPromise = User.findOne({ id: currentUserData.id }).select('following')
  const tweetInfoPromise = Tweet.findById(params.id)
    .select('repostedBy')
    .populate('repostedBy')
  const [user, tweet] = await Promise.all([currentUserInfoPromise, tweetInfoPromise])
  return (
    <>
      {tweet.repostedBy.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No Reposts yet</h1>
          <p className='text-white/50 mt-4'>
            You will find a list of everyone who reposted this post here.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          <UsersList users={tweet.repostedBy} currentUser={user} />
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
        <span>Reposted by</span>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <UsersReposted params={params} />
      </Suspense>
    </>
  )
}

export default page
