import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import Tweet from '@/lib/models/tweet'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { unstable_noStore } from 'next/cache'
import { Suspense } from 'react'

const Quotes = async ({ params }: { params: { id: string } }) => {
  const database = connectToDB()
  const currentUserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentUserInfo])
  if (!currentuser) return null
  const tweet = await Tweet.findById(params.id).populate([
    {
      path: 'quotes',
      populate: [
        {
          path: 'author',
          select: 'name username image id following followers bio',
        },
        {
          path: 'quotedTweetId',
          populate: {
            path: 'author',
            select: 'image name username',
          },
        },
      ],
    },
  ])
  return (
    <>
      {tweet.quotes.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No Quotes yet</h1>
          <p className='text-white/50 mt-4'>
            You will find a list of every post which quoted this post here.
          </p>
        </div>
      ) : (
        <div className='my-4'>
          <TweetsList tweets={tweet.quotes} />
        </div>
      )}
    </>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  unstable_noStore()
  return (
    <>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Quotes</span>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <Quotes params={params} />
      </Suspense>
    </>
  )
}

export default page
