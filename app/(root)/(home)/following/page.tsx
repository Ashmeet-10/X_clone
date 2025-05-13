import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchTweetsOfFollowingUsers } from '@/lib/actions/tweetActions'
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
    <Suspense fallback={<Loading className='items-start mt-4' />}>
      <FetchTweets />
    </Suspense>
  )
}

export default page
