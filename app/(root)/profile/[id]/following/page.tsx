import FollowButton from '@/components/FollowButton'
import Loading from '@/components/Loading'
import ProfileHoverCard from '@/components/ProfileHoverCard'
import UsersList from '@/components/UsersList'
import { fetchUser } from '@/lib/actions/userActions'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Suspense } from 'react'

const FollowingUsers = async ({ params }: { params: { id: string } }) => {
  connectToDB()
  const currentuser = await currentUser()
  if (!currentuser) return null
  const user = await fetchUser(params.id)
  const userInfo = await fetchUser(currentuser.id)
  await user.populate('following')
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
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <FollowingUsers params={params} />
    </Suspense>
  )
}

export default page
