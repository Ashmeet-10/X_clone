import {
  BarChart2,
  DotIcon,
  Edit,
  MessageCircle,
  Repeat,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import ProfileHoverCard from './ProfileHoverCard'
import LikeButton from './Buttons/LikeButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import RepostButton from './Buttons/RepostButton'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Image from 'next/image'
import DeleteTweetDialog from './Dialogs/DeleteTweetDialog'
import NonInteractiveTweetDialog from './Dialogs/NonInteractiveTweetDialog'
import { formatDateString } from '@/lib/utils'

const TweetCard = ({ tweet, post, currentUser }: any) => {
  console.log('tweetCard', tweet)
  console.log('currentUser', currentUser.communities)
  return (
    <div className={`px-4 border-b border-white/30 ${post && 'text-lg'}`}>
      {tweet?.repostedBy.includes(currentUser._id) ? (
        <p className='text-sm'>{tweet.author.name} Reposted</p>
      ) : null}
      {tweet?.community?.name ? (
        <div className='flex space-x-3'>
          <div className='w-11 flex shrink-0 justify-end'>
            <Users size={20} className='text-white/80 justify-end' />
          </div>
          <p className='font-bold text-white/50 text-sm'>
            {tweet.community.name}
          </p>
        </div>
      ) : null}
      <div className='flex space-x-3 py-2 items-center'>
        <ProfileHoverCard author={tweet.author} />
        <div className='w-full'>
          <div className='w-full flex justify-between items-center'>
            <p className='font-bold line-clamp-1'>{tweet?.author?.name}</p>
            <TooltipProvider delayDuration={100}>
              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {tweet.author.id === currentUser.id && (
                        <div className='flex -space-x-3 rounded-full hover:bg-sky-500/10 hover:text-sky-600'>
                          <DotIcon size={20} />
                          <DotIcon size={20} />
                          <DotIcon size={20} />
                        </div>
                      )}
                    </TooltipTrigger>
                    <TooltipContent className='!bg-gray-600 !text-xs'>
                      <p>More</p>
                    </TooltipContent>
                  </Tooltip>
                </PopoverTrigger>
                <PopoverContent className='mx-8 w-28 flex justify-center font-semibold !bg-black !border-2 !border-white/40 shadow-[0px_0px_16px_1px] shadow-white/40 rounded-xl space-y-4'>
                  <div className='flex items-center'>
                    <DeleteTweetDialog tweetId={tweet._id.toString()} />
                  </div>
                </PopoverContent>
              </Popover>
            </TooltipProvider>
          </div>
          <div className='flex space-x-1 items-center'>
            <p className='opacity-50 line-clamp-1'>{tweet?.author?.username}</p>
            <div className='w-1 h-1 shrink-0 rounded-full bg-white/50'></div>
            <p className='opacity-50'>{formatDateString(tweet?.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className='flex space-x-3 pb-4'>
        {!post ? <div className='w-11 h-11 shrink-0' /> : null}
        <div className='flex flex-col w-full'>
          <Link href={`/tweet/${tweet._id}`} className={`${post && 'mt-4'}`}>
            <p className='whitespace-pre-line font-medium text-white/90'>
              {tweet.text}
            </p>
          </Link>
          {tweet.quotedTweetId ? (
            <Link
              href={`/tweet/${tweet.quotedTweetId._id}`}
              className='border border-white/30 rounded-2xl mt-4 p-4'
            >
              <div className='flex items-center space-x-2'>
                <div className='relative w-9 h-9 shrink-0'>
                  <Image
                    src={tweet.quotedTweetId.author.image}
                    alt='user photo'
                    fill
                    className='rounded-full'
                  />
                </div>
                <div className=''>
                  <p className='font-bold line-clamp-1'>
                    {tweet.quotedTweetId.author.name}
                  </p>
                  <p className='opacity-50 line-clamp-1'>
                    {tweet.quotedTweetId.author.username}
                  </p>
                </div>
              </div>
              <div className='whitespace-pre-line mt-2'>
                {tweet.quotedTweetId.text}
              </div>
            </Link>
          ) : null}
          {!post ? (
            <TooltipProvider delayDuration={100}>
              <div className='flex space-x-4 mt-6 text-white/50'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex justify-center items-center'>
                      {tweet.community ? (
                        <div className='flex items-center'>
                          {currentUser.communities.includes(
                            tweet.community._id
                          ) ? (
                            <Link
                              href={`/tweet/${tweet._id}`}
                              className='flex space-x-1 items-center hover:text-sky-500'
                            >
                              <MessageCircle size={20} />
                              {tweet?.replies?.length > 0 && (
                                <span className='text-sm'>
                                  {tweet?.replies?.length}
                                </span>
                              )}
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
                          <MessageCircle size={20} />
                          {tweet?.replies?.length > 0 && (
                            <span className='text-sm'>
                              {tweet?.replies?.length}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className='!bg-gray-600 !text-xs'>
                    <p>Reply</p>
                  </TooltipContent>
                </Tooltip>
                <Popover>
                  <PopoverTrigger>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='flex space-x-1 items-center hover:text-green-400'>
                          {/* <RepostButton
                        tweetId={tweet._id.toString()}
                        reposted={tweet?.repostedBy.includes(currentUser._id)}
                      /> */}
                          <Repeat size={20} />
                          {tweet.repostedBy.length > 0 && (
                            <span className='text-sm'>
                              {tweet.repostedBy.length}
                            </span>
                          )}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex space-x-1 items-center hover:text-pink-500'>
                      {tweet.community ? (
                        <>
                          {currentUser.communities.includes(
                            tweet.community._id
                          ) ? (
                            <LikeButton
                              tweetId={tweet._id.toString()}
                              liked={currentUser.liked.includes(tweet._id)}
                              count={tweet.likes.length}
                            />
                          ) : (
                            <NonInteractiveTweetDialog type='like' />
                          )}
                        </>
                      ) : (
                        <LikeButton
                          tweetId={tweet._id.toString()}
                          liked={currentUser.liked.includes(tweet._id)}
                          count={tweet.likes.length}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className='!bg-gray-600 !text-xs'>
                    <p>
                      {currentUser.liked.includes(tweet._id)
                        ? 'Unlike'
                        : 'Like'}
                    </p>
                  </TooltipContent>
                </Tooltip>
                <BarChart2 size={20} />
              </div>
            </TooltipProvider>
          ) : null}
          {post ? (
            <div className='text-base opacity-60 mt-4 flex items-center'>
              <p>{tweet?.createdAt?.toLocaleTimeString()}</p>
              <div className='flex justify-center items-center mx-2 text-white'>
                <div className='w-1 h-1 bg-white rounded-full' />
              </div>
              <p>{tweet?.createdAt?.toDateString()}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default TweetCard
