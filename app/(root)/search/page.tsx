import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import ProfileHoverCard from '@/components/ProfileHoverCard'
import SearchBar from '@/components/SearchBar'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import Link from 'next/link'
import { Suspense } from 'react'

const Users = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  let users = []
  await connectToDB()
  if (searchParams.q) {
    users = await User.find({
      $or: [
        { name: { $regex: searchParams.q, $options: 'i' } },
        { username: { $regex: searchParams.q, $options: 'i' } },
      ],
    }).select('name username image id following followers bio')
  } else
    users = await User.find({}).select(
      'name username image id following followers bio'
    )
  return (
    <div className='p-4 space-y-4'>
      {users.map((user, idx) => (
        <Link
          href={`/profile/${user.id}`}
          key={idx}
          className='flex space-x-3 py-2 items-center'
        >
          <ProfileHoverCard author={user} />
          <div className=''>
            <p className='font-bold line-clamp-1'>{user.name}</p>
            <p className='opacity-50 line-clamp-1'>{user.username}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

const page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Search</span>
      </div>
      <SearchBar />

      <Suspense
        key={searchParams?.q?.toString()}
        fallback={<Loading className='items-start' />}
      >
        <Users searchParams={searchParams} />
      </Suspense>
    </>
  )
}

export default page
