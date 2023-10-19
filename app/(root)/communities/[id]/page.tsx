import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import Community from '@/lib/models/community'
import { connectToDB } from '@/lib/mongoose'
import Link from 'next/link'
import { Suspense } from 'react'

const Tweets = async ({ params }: { params: { id: string } }) => {
  connectToDB()
  const community = await Community.findById(params.id)
    .populate({
      path: 'members',
      select: 'image',
    })
    .populate({
      path: 'posts',
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
        {
          path: 'community',
          select: 'name',
        },
      ],
    })

  if (community.posts.length === 0) {
    return (
      <div className='m-4 mt-6'>
        <h1 className='text-3xl font-bold'>No community tweets to show.</h1>
        <p className='text-white/50 mt-4'>
          When any member of the community will post a tweet, they'll show up
          here.
        </p>
      </div>
    )
  }
  return (
    <div className='m-4'>
      <TweetsList tweets={community.posts} />
    </div>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='flex h-14 border-b border-white/30 ease-in-out duration-300'>
        <Link
          href={`/communities/${params.id}`}
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='border-b-4 border-blue-500 flex font-semibold justify-center items-center h-full'>
            Posts
          </span>
        </Link>
        <Link
          href={`/communities/${params.id}/about`}
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='flex text-white/50 justify-center items-center h-full border-b-4 border-transparent'>
            About
          </span>
        </Link>
      </div>
      <Suspense
        fallback={<Loading className='min-h-[60vh] items-start mt-4' />}
      >
        <Tweets params={params} />
      </Suspense>
    </>
  )
}

export default page
