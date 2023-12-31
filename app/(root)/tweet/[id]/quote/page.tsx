import TweetForm from '@/components/Forms/TweetForm'
import Loading from '@/components/Loading'
import Community from '@/lib/models/community'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { unstable_noStore } from 'next/cache'
import { Suspense } from 'react'

const QuoteTweet = async ({ params }: { params: { id: string } }) => {
  unstable_noStore()
  const database = connectToDB()
  const currentUserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentUserInfo])
  if (!currentuser) return null
  const userInfo = User.findOne({ id: currentuser.id })
    .select('image communities')
    .populate({
      path: 'communities',
      select: 'name',
    })
  const tweetInfo = Tweet.findById(params.id).select('author text').populate({
    path: 'author',
    select: 'image name username',
  })
  const [user, tweet] = await Promise.all([userInfo, tweetInfo])
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

const page = ({ params }: { params: { id: string } }) => {
  unstable_noStore()
  return (
    <Suspense fallback={<Loading className='min-h-[90vh] items-center' />}>
      <QuoteTweet params={params} />
    </Suspense>
  )
}

export default page
