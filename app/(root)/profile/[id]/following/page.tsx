import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { unstable_noStore } from 'next/cache'
import { Suspense } from 'react'

const FollowingUsers = async ({ params }: { params: { id: string } }) => {
  connectToDB()
  const currentuser = await currentUser()
  if (!currentuser) return null
  const userPromise = User.findOne({ id: params.id })
    .select('following')
    .populate('following')
  const userInfoPromise = User.findOne({ id: currentuser.id }).select(
    'following'
  )
  const [user, userInfo] = await Promise.all([userPromise, userInfoPromise])
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

const page = ({ params }: { params: { id: string } }) => {
  unstable_noStore()
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <div className='min-h-[60vh] px-4'>
        <FollowingUsers params={params} />
      </div>
    </Suspense>
  )
}

export default page
