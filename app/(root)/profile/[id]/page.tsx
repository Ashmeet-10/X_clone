import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import { fetchTweetsByUserId } from '@/lib/actions/tweetActions'
import { Suspense } from 'react'

const FetchUserTweets = async ({ params }: { params: { id: string } }) => {
  const tweets = await fetchTweetsByUserId(params.id)
  if (tweets.length === 0) {
    return (
      <div className='m-4 mt-6'>
        <h1 className='text-3xl font-bold'>This account have no post yet.</h1>
        <p className='text-white/50 mt-4'>
          When this account will post something, they'll show up here.
        </p>
      </div>
    )
  }
  return (
    <div>
      <TweetsList tweets={tweets} />
    </div>
  )
}

const page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<Loading className='min-h-[60vh] items-start' />}>
      <FetchUserTweets params={params} />
    </Suspense>
  )
}

export default page
