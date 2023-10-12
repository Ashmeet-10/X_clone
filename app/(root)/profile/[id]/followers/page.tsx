import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import { fetchUser } from '@/lib/actions/userActions'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Suspense } from 'react'

const Followers = async ({ params }: { params: { id: string } }) => {
  connectToDB()
  const currentuser = await currentUser()
  if (!currentuser) return null
  const user = await fetchUser(params.id)
  const userInfo = await fetchUser(currentuser.id)
  await user.populate('followers')
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
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <Followers params={params} />
    </Suspense>
  )
}

export default page
