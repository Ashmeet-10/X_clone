import Tweet from '@/lib/models/tweet'
import { BarChart2, Heart, MessageCircle, Repeat } from 'lucide-react'
import ProfileHoverCard from './ProfileHoverCard'
import Link from 'next/link'
import LikeButton from './Buttons/LikeButton'

type Reply = {
  _id: string
  text: string
  parentId: string
  author: {
    _id: string
    id: string
    name: string
    username: string
    image: string
    bio: string
    following: []
    followers: []
  }
  createdAt: Date
  replies: []
  likes: []
}

const Replies = async ({
  tweetId,
  likedTweets,
}: {
  tweetId: string
  likedTweets: [string]
}) => {
  const tweet = await Tweet.findById(tweetId).populate({
    path: 'replies',
    populate: {
      path: 'author',
      select: 'id name username image bio following followers',
    },
  })
  const replies = tweet.replies.sort(
    (a: Reply, b: Reply) => b.createdAt.getTime() - a.createdAt.getTime()
  )
  console.log('REPLIES', replies)
  return (
    <div>
      {replies.map((reply: Reply) => (
        <div
          key={reply.createdAt.getTime()}
          className='flex border-b border-white/30 py-4'
        >
          <div className='flex flex-col items-center mr-4'>
            <div className='relative w-10 h-10 shrink-0'>
              <ProfileHoverCard author={reply.author} />
            </div>
            <div className='h-full w-0.5 bg-white/20'></div>
          </div>
          <div className='flex flex-col'>
            <h3 className='text-lg font-bold line-clamp-1'>
              {reply.author.name}
            </h3>
            <div className='flex space-x-2 opacity-50'>
              <span className='line-clamp-1'>{reply.author.username}</span>
              <div className='flex justify-center items-center mx-2 text-white'>
                <div className='w-1 h-1 rounded-full bg-white' />
              </div>
              <span>{reply.createdAt.toLocaleTimeString()}</span>
            </div>
            <p className='mt-1'>{reply.text}</p>
            <div className='flex justify-between space-x-4 opacity-50 my-4'>
              <Link
                href={`/tweet/${reply._id}`}
                className='flex space-x-1 items-center hover:text-sky-400'
              >
                <MessageCircle className='w-5 h-5' />
                <p className='text-sm'>{reply.replies.length}</p>
              </Link>
              <Repeat className='w-5 h-5' />
              <div className='flex space-x-1 items-center'>
                <LikeButton
                  tweetId={reply._id}
                  liked={likedTweets.includes(reply._id)}
                  count={reply.likes.length}
                />
                <span>{reply.likes.length}</span>
              </div>
              <BarChart2 className='w-5 h-5' />
            </div>
            {reply.replies.length > 0 ? (
              <Link href={`/tweet/${reply._id}`}>
                <h4 className='text-blue-600'>
                  {reply.replies.length > 1
                    ? reply.replies.length + ' replies'
                    : reply.replies.length + ' reply'}
                </h4>
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Replies
