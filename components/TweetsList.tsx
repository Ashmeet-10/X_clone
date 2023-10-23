import { currentUser } from '@clerk/nextjs'
import TweetCard from './TweetCard'
import User from '@/lib/models/user'

const TweetsList = async ({ tweets }: any) => {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await User.findOne({id:user.id}).select('communities id liked')
  return (
    <div className='flex flex-col space-y-4'>
      {tweets.map((tweet: any) => (
        <TweetCard key={tweet._id} tweet={tweet} currentUser={userInfo} />
      ))}
    </div>
  )
}

export default TweetsList
