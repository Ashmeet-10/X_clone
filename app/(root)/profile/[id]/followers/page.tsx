import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { unstable_noStore } from 'next/cache'
import { Suspense } from 'react'

const Followers = async ({ params }: { params: { id: string } }) => {
  connectToDB()
  const currentuser = await currentUser()
  if (!currentuser) return null
  const userPromise = User.findOne({ id: params.id })
    .select('followers')
    .populate('followers')
  const userInfoPromise = User.findOne({ id: currentuser.id }).select(
    'following'
  )
  const [user, userInfo] = await Promise.all([userPromise, userInfoPromise])
  if (user.followers.length === 0) {
    return (
      <div className='m-4 mt-6'>
        <h1 className='text-3xl font-bold'>
          This account has no followers yet.
        </h1>
        <p className='text-white/50 mt-4'>
          When someone follows this account, they'll show up here. Tweeting and
          interacting with others helps boost followers.
        </p>
      </div>
    )
  }
  return <UsersList users={user.followers} currentUser={userInfo} />
}

const page = ({ params }: { params: { id: string } }) => {
  unstable_noStore()
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <div className='min-h-[60vh] px-4'>
        <Followers params={params} />
      </div>
    </Suspense>
  )
}

export default page
