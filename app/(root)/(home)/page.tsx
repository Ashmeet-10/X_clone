import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchTweets } from '@/lib/actions/tweetActions'
import { unstable_noStore } from 'next/cache'
import { Suspense } from 'react'

const FetchTweets = async () => {
  const tweets = await fetchTweets()
  return <TweetsList tweets={tweets} />
}

const Home = () => {
  unstable_noStore()
  return (
    <Suspense fallback={<Loading className='items-start mt-4' />}>
      <FetchTweets />
    </Suspense>
  )
}

export default Home
