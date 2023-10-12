import BackButton from '@/components/BackButton'
import JoinCommunityDialog from '@/components/JoinCommunityDialog'
import LeaveCommunityDialog from '@/components/LeaveCommunityDialog'
import Loading from '@/components/Loading'
import { fetchUser } from '@/lib/actions/userActions'
import Community from '@/lib/models/community'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const FetchData = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  const database = connectToDB()
  const communityInfo = Community.findById(params.id).populate({
    path: 'members',
    select: 'image',
  })
  const currentUserInfo = currentUser()
  const [db, community, currentuser] = await Promise.all([
    database,
    communityInfo,
    currentUserInfo,
  ])
  if (!currentuser) return null
  const user = await fetchUser(currentuser.id)
  return (
    <div>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>{community.name}</span>
      </div>
      <div className='relative w-full aspect-video border-b-8 border-white/20'>
        <Image
          src={community.profileImage}
          fill
          priority
          className='object-cover'
          alt='community profile image'
        />
      </div>
      <div className='p-6 bg-gray-900/60 space-y-4'>
        <h2 className='text-3xl font-bold'>{community.name}</h2>
        <h3 className=''>{community.purpose}</h3>
        <div className='flex flex-wrap items-center'>
          <div className='flex -space-x-2'>
            {community.members.slice(0, 5).map((member: any, idx: number) => (
              <div
                key={idx}
                className={`relative w-9 h-9 overflow-hidden shrink-0`}
                style={{ zIndex: 5 - idx * 1 }}
              >
                <Image
                  src={member.image}
                  alt='member image'
                  fill
                  className='rounded-full object-cover border-2 border-white'
                />
              </div>
            ))}
          </div>
          <div className='ml-5 flex space-x-1'>
            <span className='font-bold'>{community.members.length}</span>
            <span>Members</span>
          </div>
        </div>
        <div className=''>
          {user.communities.includes(community._id) ? (
            <LeaveCommunityDialog
              communityName={community.name}
              communityId={community._id.toString()}
            />
          ) : (
            <JoinCommunityDialog community={community} />
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

const CommunityLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  return (
    <Suspense fallback={<Loading className='min-h-[90vh] items-center' />}>
      <FetchData params={params} children={children} />
    </Suspense>
  )
}

export default CommunityLayout
