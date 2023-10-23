import BookmarkButton from '@/components/Buttons/BookmarkButton'
import LikeButton from '@/components/Buttons/LikeButton'
import ReplyForm from '@/components/Forms/ReplyForm'
import TweetCard from '@/components/TweetCard'
import { fetchTweetByTweetId } from '@/lib/actions/tweetActions'
import { currentUser } from '@clerk/nextjs'
import { Edit, MessageCircle, Repeat } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import NonInteractiveTweetDialog from '@/components/Dialogs/NonInteractiveTweetDialog'
import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import TweetsList from '@/components/TweetsList'
import User from '@/lib/models/user'
import Tweet from '@/lib/models/tweet'

const Replies = async ({ tweet }: { tweet: any }) => {
  const replies = await tweet.populate({
    path: 'replies',
    populate: {
      path: 'author',
      select: 'name username image id following followers bio',
    },
  })
  return <TweetsList tweets={replies.replies} />
}

const TweetData = async ({ params }: { params: { id: string } }) => {
  const currentuser = await currentUser()
  if (!currentuser) return null
  const userInfo = User.findOne({ id: currentuser.id }).select(
    'liked bookmarked communities image'
  )
  const tweetInfo = fetchTweetByTweetId(params.id)
  const [user, tweet] = await Promise.all([userInfo, tweetInfo])
  return (
    <div className='relative'>
      <div className=''>
        <div>
          <TweetCard tweet={tweet} post={true} currentUser={user} />
        </div>
        <div className='text-sm flex border-b border-white/30 px-4 pb-5 mt-5 flex-wrap'>
          <Link
            href={`/tweet/${params.id}/reposts`}
            className='flex space-x-1 mr-4'
          >
            <span className='font-bold'>{tweet.repostedBy.length}</span>
            <span className='opacity-40'>Reposts</span>
          </Link>
          <Link
            href={`/tweet/${params.id}/likes`}
            className='flex space-x-1 mr-4'
          >
            <span className='font-bold'>{tweet.likes.length}</span>
            <span className='opacity-40'>Likes</span>
          </Link>
          <Link
            href={`/tweet/${params.id}/quotes`}
            className='flex space-x-1 mr-4'
          >
            <span className='font-bold'>{tweet.quotes.length}</span>
            <span className='opacity-40'>Quotes</span>
          </Link>
          <div className='flex space-x-1 mr-4'>
            <span className='font-bold'>{tweet.bookmarkedBy.length}</span>
            <span className='opacity-40'>Bookmarks</span>
          </div>
        </div>
        <div className='border-b border-white/30 pb-4 mt-4'>
          <div className='flex space-x-4 justify-between items-center mx-8'>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {tweet.community ? (
                    <div className='flex items-center'>
                      {user.communities.includes(tweet.community._id) ? (
                        <Link
                          href={`/tweet/${tweet._id}`}
                          className='flex space-x-1 items-center hover:text-sky-500'
                        >
                          <MessageCircle
                            size={22}
                            className='text-white/50 hover:text-sky-600'
                          />
                        </Link>
                      ) : (
                        <NonInteractiveTweetDialog type='reply' />
                      )}
                    </div>
                  ) : (
                    <Link
                      href={`/tweet/${tweet._id}`}
                      className='flex space-x-1 items-center hover:text-sky-500'
                    >
                      <MessageCircle
                        size={22}
                        className='text-white/50 hover:text-sky-600'
                      />
                    </Link>
                  )}
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger className='text-white/50' asChild>
                      <div className='flex space-x-1 items-center hover:text-green-400'>
                        {/* <RepostButton
                        tweetId={tweet._id.toString()}
                        reposted={tweet?.repostedBy.includes(currentUser._id)}
                      /> */}
                        <Repeat size={20} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='!bg-gray-600 !text-xs'>
                      <p>Repost</p>
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent className='mx-8 w-36 font-semibold !bg-black !border-2 !border-white/40 shadow-[0px_0px_16px_1px] shadow-white/40 rounded-xl space-y-4'>
                  <div className='flex space-x-4 items-center'>
                    <Repeat size={20} />
                    <p>Repost</p>
                  </div>
                  <Link
                    href={`/tweet/${tweet._id}/quote`}
                    className='flex space-x-4 items-center'
                  >
                    <Edit size={20} />
                    <p>Quote</p>
                  </Link>
                </PopoverContent>
              </Popover>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='flex space-x-1 items-center hover:text-pink-500'>
                    {tweet.community ? (
                      <>
                        {user.communities.includes(tweet.community._id) ? (
                          <LikeButton
                            tweetId={tweet._id.toString()}
                            liked={user.liked.includes(tweet._id)}
                            count={tweet.likes.length}
                            showLikeCount={false}
                          />
                        ) : (
                          <NonInteractiveTweetDialog type='like' />
                        )}
                      </>
                    ) : (
                      <LikeButton
                        tweetId={tweet._id.toString()}
                        liked={user.liked.includes(tweet._id)}
                        count={tweet.likes.length}
                        showLikeCount={false}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className='!bg-gray-600 !text-xs'>
                  <p>{user.liked.includes(tweet._id) ? 'Unlike' : 'Like'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <BookmarkButton
              tweetId={tweet._id.toString()}
              bookmarked={user.bookmarked.includes(tweet._id)}
            />
          </div>
        </div>
        <div className='mt-4 px-4 border-b border-white/30 pb-4'>
          <ReplyForm
            user={{
              image: user.image,
            }}
            tweetId={tweet?._id.toString()}
            interactiveTweet={
              (tweet.community &&
                user.communities.includes(tweet.community._id)) ||
              !tweet.community
            }
          />
        </div>
        <div className='mt-4'>
          <Suspense
            fallback={<Loading className='min-h-[80vh] items-start mt-4' />}
          >
            <Replies tweet={tweet} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='flex space-x-10 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 p-4 text-lg items-center'>
        <BackButton />
        <span>Post</span>
      </div>
      <Suspense fallback={<Loading className='items-start' />}>
        <TweetData params={params} />
      </Suspense>
    </>
  )
}

export default page
