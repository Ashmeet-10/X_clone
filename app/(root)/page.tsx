import LeftSidebar from '@/components/LeftSidebar'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchTweets } from '@/lib/actions/tweetActions'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const FetchTweets = async () => {
  const tweets = await fetchTweets()
  return <TweetsList tweets={tweets} />
}

const Home = () => {
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
          <span className='border-b-4 border-blue-500 flex font-semibold justify-center items-center h-full'>
            For you
          </span>
        </Link>
        <Link
          href='/following'
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='flex text-white/50 justify-center items-center h-full border-b-4 border-transparent'>
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

export default Home
