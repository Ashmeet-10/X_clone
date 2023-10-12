import BackButton from '@/components/BackButton'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { Button } from '@/components/ui/button'
import { fetchCommunityTweetsForCurrentUser } from '@/lib/actions/tweetActions'
import { fetchUser } from '@/lib/actions/userActions'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { Heart, Search, Sparkles, UserPlus2Icon, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const FetchJoinedCommunityTweets = async () => {
  const database = connectToDB()
  const currentUserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentUserInfo])
  if (!currentuser) return null
  const userInfo = fetchUser(currentuser.id)
  const tweetsInfo = fetchCommunityTweetsForCurrentUser()
  const [user, tweets] = await Promise.all([userInfo, tweetsInfo])
  return (
    <div>
      {user.communities.length === 0 ? (
        <div className='m-8 space-y-8'>
          <div className='space-y-2'>
            <h1 className='text-3xl font-extrabold'>
              Welcome to Twitter Communities
            </h1>
            <h2 className='opacity-60 font-medium'>
              Communities are moderated discussion groups where people on
              Twitter can connect and share
            </h2>
          </div>
          <div className='space-y-6'>
            <div className='flex space-x-4'>
              <Sparkles size={25} className='shrink-0' />
              <div className=''>
                <h3 className='font-bold'>Meet others with your interests</h3>
                <p className='opacity-60 font-medium'>
                  Talk to people who care about the same things you do.
                </p>
              </div>
            </div>
            <div className='flex space-x-4'>
              <Users size={25} className='shrink-0' />
              <div className=''>
                <h3 className='font-bold'>Tweet directly to a Community</h3>
                <p className='opacity-60 font-medium'>
                  Your Tweets are shared with other Community members - not your
                  followers.
                </p>
              </div>
            </div>
            <div className='flex space-x-4'>
              <Heart size={25} className='shrink-0' />
              <div className=''>
                <h3 className='font-bold'>Get backup when you need it</h3>
                <p className='opacity-60 font-medium'>
                  Admins and moderators help manage Communities and keep
                  conversations on track.
                </p>
              </div>
            </div>
            <Link href='/communities/search'>
              <Button className='w-full rounded-full mt-6'>Check it out</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {tweets.length === 0 ? (
            <div className='m-4'>
              <h2 className='text-2xl'>No Community tweets to show</h2>
            </div>
          ) : (
            <div className='m-4'>
              <TweetsList tweets={tweets} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

const page = () => {
  return (
    <>
      <div className='p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-10'>
            <BackButton />
            <span>Communities</span>
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/communities/search'>
              <Search size={21} />
            </Link>
            <Link href='/communities/create'>
              <UserPlus2Icon size={26} />
            </Link>
          </div>
        </div>
      </div>
      <Suspense
        fallback={<Loading className='min-h-[60vh] items-start mt-4' />}
      >
        <FetchJoinedCommunityTweets />
      </Suspense>
    </>
  )
}

export default page
