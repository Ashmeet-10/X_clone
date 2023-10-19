import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchLikedTweetsByUserId } from '@/lib/actions/tweetActions'
import { Suspense } from 'react'

const LikedTweets = async ({ params }: { params: { id: string } }) => {
  const likedTweets = await fetchLikedTweetsByUserId(params.id)
  if (likedTweets.length === 0) {
    return (
      <div className='m-4 mt-6'>
        <h1 className='text-3xl font-bold'>
          This account has no liked tweets.
        </h1>
        <p className='text-white/50 mt-4'>
          When this account will like any post, they'll show up here.
        </p>
      </div>
    )
  }
  return (
    <div>
      <TweetsList tweets={likedTweets} />
    </div>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <LikedTweets params={params} />
    </Suspense>
  )
}

export default page
