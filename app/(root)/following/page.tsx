import LeftSidebar from '@/components/LeftSidebar'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchTweetsOfFollowingUsers } from '@/lib/actions/tweetActions'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const FetchTweets = async () => {
  const tweets = await fetchTweetsOfFollowingUsers()
  if (tweets.length === 0) {
    return (
      <div className='m-8'>
        <h1 className='text-4xl font-bold'>No tweets to show</h1>
        <p className='text-white/50 mt-4'>
          Tweets of users you follow will show up here.
        </p>
      </div>
    )
  }
  return <TweetsList tweets={tweets} />
}

const page = () => {
  return (
    <div className='mx-4'>
      <div className='flex w-full h-16 justify-center items-center z-20'>
        <div className='w-1/2 flex items-center'>
          <LeftSidebar />
        </div>
        <div className='w-6 aspect-square relative'>
          <Image src='/assets/X_logo.svg' alt='logo' fill />
        </div>
        <div className='w-1/2' />
      </div>
      <div className='z-20 flex h-14 border-b border-white/30 sticky top-0 left-0 ease-in-out duration-300 bg-black/60 backdrop-blur-md'>
        <Link
          href='/'
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='flex text-white/50 justify-center items-center h-full border-b-4 border-transparent'>
            For you
          </span>
        </Link>
        <Link
          href='/'
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='border-b-4 border-blue-500 flex font-semibold justify-center items-center h-full '>
            Following
          </span>
        </Link>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <FetchTweets />
      </Suspense>
    </div>
  )
}

export default page
