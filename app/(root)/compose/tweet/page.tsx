import Loading from '@/components/Loading'
import TweetForm from '@/components/Forms/TweetForm'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

const CreateTweet = async () => {
  const database = connectToDB()
  const currentUserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentUserInfo])
  if (!currentuser) return null
  const user = await User.findOne({ id: currentuser.id })
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
    <Suspense fallback={<Loading className='min-h-[80vh] items-center' />}>
      <CreateTweet />
    </Suspense>
  )
}

export default page
