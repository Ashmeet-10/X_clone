import TweetForm from '@/components/Forms/TweetForm'
import Loading from '@/components/Loading'
import Community from '@/lib/models/community'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs/server'
import { Suspense } from 'react'

const QuoteTweet = async ({ params }: { params: { id: string } }) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const userInfoPromise = User.findOne({ id: currentUserData.id })
    .select('image communities')
    .populate({
      path: 'communities',
      select: 'name',
    })
  const tweetInfoPromise = Tweet.findById(params.id).select('author text').populate({
    path: 'author',
    select: 'image name username',
  })
  const [user, tweet] = await Promise.all([userInfoPromise, tweetInfoPromise])
  return (
    <div className='m-4'>
      <TweetForm
        user={{
          image: user.image,
          id: user._id.toString(),
        }}
        tweet={JSON.parse(JSON.stringify(tweet))}
        communities={JSON.parse(JSON.stringify(user.communities))}
      />
    </div>
  )
}

const page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<Loading className='min-h-[90vh] items-center' />}>
      <QuoteTweet params={params} />
    </Suspense>
  )
}

export default page
