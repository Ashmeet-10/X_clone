import BackButton from '@/components/Buttons/BackButton'
import FollowButton from '@/components/Buttons/FollowButton'
import Loading from '@/components/Loading'
import ProfileTabs from '@/components/ProfileTabs'
import { Button } from '@/components/ui/button'
import { fetchUser } from '@/lib/actions/userActions'
import { currentUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  const currentuser = await currentUser()
  if (!currentuser) return null
  const currentUserPromise = fetchUser(currentuser.id)
  const userPromise = fetchUser(params.id)
  const [currentUserInfo, userInfo] = await Promise.all([
    currentUserPromise,
    userPromise,
  ])
  return (
    <div className='flex flex-col'>
      <div className='flex space-x-10 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 p-4 text-lg items-center'>
        <BackButton />
        <div className='flex flex-col'>
          <span>{userInfo?.name}</span>
          <span className='text-sm opacity-60 font-normal'>
            {userInfo?.tweets.length} Posts
          </span>
        </div>
      </div>
      <div className='w-full aspect-[16/5] bg-zinc-800'></div>
      <div className='mx-4 relative'>
        <div className='relative w-1/5 aspect-square -mt-7'>
          <Image
            src={userInfo?.image}
            alt='user photo'
            fill
            className='rounded-full'
          />
        </div>
        {currentuser.id === userInfo?.id ? (
          <div className='absolute top-4 right-4'>
            <Link href='/profile/edit-profile'>
              <Button
                variant='outline'
                className='!bg-black hover:!bg-zinc-900 !border !border-white/50 ease-in-out duration-200 rounded-full font-semibold text-lg'
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        ) : (
          <div className='absolute top-4 right-4'>
            <FollowButton
              userId={userInfo?.id}
              followed={currentUserInfo.following.includes(userInfo._id)}
            />
          </div>
        )}
        <div className='mt-8'>
          <p className='font-bold text-2xl'>{userInfo?.name}</p>
          <p className='opacity-50'>{userInfo?.username}</p>
          <p className='mt-4'>{userInfo.bio}</p>
          <p className='opacity-50 mt-4 mb-3'>
            Joined {userInfo.joinedOn?.toDateString()}
          </p>
          <div className='text-white/50 mt-3 mb-5 flex space-x-3 text-sm'>
            <Link href={`/profile/${userInfo.id}/following`}>
              <span className='text-white font-bold'>
                {userInfo.following.length}
              </span>{' '}
              Following
            </Link>
            <Link href={`/profile/${userInfo.id}/followers`}>
              <span className='text-white font-bold'>
                {userInfo.followers.length}
              </span>{' '}
              Followers{' '}
            </Link>
          </div>
        </div>
        <div className='mb-4 -ml-4'>
          <ProfileTabs userId={params.id} />
        </div>

        <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}

const ProfileLayout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) => {
  return (
    <Suspense fallback={<Loading className='min-h-[80vh] items-center' />}>
      <Layout children={children} params={params} />
    </Suspense>
  )
}

export default ProfileLayout
