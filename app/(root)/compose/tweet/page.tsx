import Loading from '@/components/Loading'
import TweetForm from '@/components/Forms/TweetForm'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import Community from '@/lib/models/community'

const CreateTweet = async () => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const user = await User.findOne({ id: currentUserData.id })
    .select('image communities')
    .populate('communities')
  return (
    <div className='m-4'>
      <TweetForm
        user={{
          image: user.image,
          id: user._id.toString(),
        }}
        communities={JSON.parse(JSON.stringify(user.communities))}
      />
    </div>
  )
}

const page = () => {
  return (
    <Suspense fallback={<Loading className='min-h-[90vh] items-center' />}>
      <CreateTweet />
    </Suspense>
  )
}

export default page
