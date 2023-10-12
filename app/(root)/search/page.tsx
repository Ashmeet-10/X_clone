import ProfileHoverCard from '@/components/ProfileHoverCard'
import User from '@/lib/models/user'
import Link from 'next/link'

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  let users = []
  if (searchParams.q) {
    users = await User.find({
      $or: [
        { name: { $regex: searchParams.q, $options: 'i' } },
        { username: { $regex: searchParams.q, $options: 'i' } },
      ],
    })
  } else users = await User.find({})
  return (
    <div className='p-4 space-y-4'>
      {users.map((user, idx) => (
        <Link href={`/profile/${user.id}`} key={idx} className='flex space-x-3 py-2 items-center'>
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

export default page
