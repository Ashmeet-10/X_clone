import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs/server'
import { Suspense } from 'react'

const FollowingUsers = async ({ params }: { params: { id: string } }) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([
    connectDbPromise,
    currentUserPromise,
  ])
  if (!currentUserData) return null
  const profileUserPromise = User.findOne({ id: params.id })
    .select('following')
    .populate('following')
  const currentUserInfoPromise = User.findOne({
    id: currentUserData.id,
  }).select('following')
  const [user, userInfo] = await Promise.all([
    profileUserPromise,
    currentUserInfoPromise,
  ])
  if (user.following.length === 0) {
    return (
      <div className='m-4 mt-6'>
        <h1 className='text-3xl font-bold'>
          This account is not following anyone yet.
        </h1>
        <p className='text-white/50 mt-4'>
          When this account will follow someone, they'll show up here.
        </p>
      </div>
    )
  }
  return <UsersList users={user.following} currentUser={userInfo} />
}

const page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <div className='min-h-[60vh] px-4'>
        <FollowingUsers params={params} />
      </div>
    </Suspense>
  )
}

export default page
