import { currentUser } from '@clerk/nextjs/server'
import { connectToDB } from '@/lib/mongoose'
import TweetCard from './TweetCard'
import User from '@/lib/models/user'

const TweetsList = async ({ tweets }: any) => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const userInfo = await User.findOne({ id: currentUserData.id }).select('communities id liked')
  return (
    <div className='flex flex-col space-y-4'>
      {tweets.map((tweet: any) => (
        <TweetCard key={tweet._id} tweet={tweet} currentUser={userInfo} />
      ))}
    </div>
  )
}

export default TweetsList
