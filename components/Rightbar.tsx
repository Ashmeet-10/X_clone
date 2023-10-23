import { connectToDB } from '@/lib/mongoose'
import User from '@/lib/models/user'
import ProfileHoverCard from './ProfileHoverCard'
import Link from 'next/link'
import Community from '@/lib/models/community'
import Image from 'next/image'
import { Suspense } from 'react'
import Loading from './Loading'
import { currentUser } from '@clerk/nextjs'

const Users = async () => {
  const database = connectToDB()
  const currentuserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentuserInfo])
  if (!currentuser) return null
  const users = await User.find({ id: { $ne: currentuser.id } })
    .select('name username image id following followers bio')
    .limit(4)
  return (
    <div className='flex flex-col justify-center border border-white/40 shadow-[-1px_-1px_1px_0px] shadow-white/60 p-4 rounded-2xl'>
      <h2 className='text-2xl font-bold'>People you might know</h2>
      <div className='space-y-4 mt-6'>
        {users.map((user, idx) => (
          <div key={idx} className='flex space-x-3 py-2 items-center'>
            <ProfileHoverCard author={user} />
            <Link href={`/profile/${user.id}`} className=''>
              <p className='font-bold line-clamp-1'>{user.name}</p>
              <p className='opacity-50 line-clamp-1'>{user.username}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

const Communities = async () => {
  connectToDB()
  const communities = await Community.find({})
    .select('name profileImage members')
    .limit(4)
  return (
    <div className='flex flex-col justify-center border border-white/40 shadow-[-1px_-1px_1px_0px] shadow-white/60 p-4 rounded-2xl'>
      <h2 className='text-2xl font-bold mb-6'>Communities</h2>
      {communities.map((community, idx) => (
        <Link key={idx} href={`/communities/${community._id}`}>
          <div className='flex space-x-4 py-2 items-center'>
            <div className='relative w-16 h-16 shrink-0'>
              <Image
                src={community.profileImage}
                fill
                className='rounded-xl object-cover'
                alt='community profile image'
              />
            </div>
            <div className=''>
              <p className='font-bold line-clamp-1'>{community.name}</p>
              <p className='line-clamp-1 space-x-1'>
                <span className='font-bold'>{community.members.length}</span>
                <span className='opacity-50'>members</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

const Rightbar = () => {
  return (
    <div className='relative w-64 xl:w-72 2xl:w-80'>
      <div className='absolute top-0 left-0'>
        <div className='fixed w-64 h-screen space-y-12 overflow-y-scroll scrollbar-hide flex flex-col px-1 py-4 xl:w-72 2xl:w-80'>
          <Suspense fallback={<Loading className='min-h-[20vh] items-start' />}>
            <Communities />
          </Suspense>
          <Suspense fallback={<Loading className='min-h-[20vh] items-start' />}>
            <Users />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Rightbar
