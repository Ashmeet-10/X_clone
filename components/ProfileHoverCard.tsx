import Image from 'next/image'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Link from 'next/link'
import { currentUser } from '@clerk/nextjs'
import FollowButton from './Buttons/FollowButton'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'

const ProfileHoverCard = async ({ author }: any) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const userInfo = await User.findOne({ id: currentUserData.id }).select('following')
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Link href={`/profile/${author?.id}`}>
          <div className='relative w-11 h-11 shrink-0'>
            <Image
              src={author.image}
              alt='user photo'
              fill
              className='rounded-full'
            />
          </div>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className='w-80 !bg-black mx-4 !border-2 !border-white/40 shadow-[0px_0px_16px_1px] shadow-white/40 rounded-2xl'>
        <div className='flex flex-col'>
          <div className='flex justify-between'>
            <div className='relative w-16 h-16'>
              <Image
                src={author.image}
                alt='user photo'
                fill
                className='rounded-full'
              />
            </div>
            {currentUserData.id !== author.id ? (
              <FollowButton
                userId={author.id}
                followed={userInfo.following.includes(author._id)}
              />
            ) : null}
          </div>
          <p className='font-bold text-xl mt-4 mb-1'>{author.name}</p>
          <p className='opacity-50'>{author.username}</p>
          <p className='my-4'>{author.bio}</p>
          <p className='flex items-center opacity-50 space-x-6'>
            <span className=''>{author.following.length} Following</span>
            <span className=''>{author.followers.length} Followers</span>
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default ProfileHoverCard
