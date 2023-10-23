import TweetForm from '@/components/Forms/TweetForm'
import Community from '@/lib/models/community'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'

const page = async ({ params }: { params: { id: string } }) => {
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

export default page
