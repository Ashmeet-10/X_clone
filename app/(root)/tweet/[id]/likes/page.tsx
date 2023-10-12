import BackButton from '@/components/BackButton'
import FollowButton from '@/components/FollowButton'
import ProfileHoverCard from '@/components/ProfileHoverCard'
import { fetchUser } from '@/lib/actions/userActions'
import Tweet from '@/lib/models/tweet'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'

const page = async ({ params }: { params: { id: string } }) => {
  const database = connectToDB()
  const currentUserInfo = currentUser()
  const [db, currentuser] = await Promise.all([database, currentUserInfo])
  if (!currentuser) return null
  const userInfo = fetchUser(currentuser.id)
  const tweetInfo = Tweet.findById(params.id).populate('likes')
  const [user, tweet] = await Promise.all([userInfo, tweetInfo])
  return (
    <div className=''>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Liked by</span>
      </div>
      {tweet.likes.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No likes yet</h1>
          <p className='text-white/50 mt-4'>
            When someone taps the heart to Like this post, it’ll show up here.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          {tweet?.likes.map((userLiked: any) => (
            <div className='py-4'>
              <div className='flex items-center space-x-4'>
                <ProfileHoverCard author={userLiked} />
                <div className='flex justify-between items-center space-x-2 w-full'>
                  <div className=''>
                    <p className='font-bold line-clamp-1 text-lg'>
                      {userLiked?.name}
                    </p>
                    <p className='opacity-50 line-clamp-1'>
                      {userLiked?.username}
                    </p>
                  </div>
                  <FollowButton
                    userId={userLiked?.id}
                    followed={user.following.includes(userLiked._id)}
                  />
                </div>
              </div>
              <div className='flex my-1 font-medium space-x-4'>
                <div className='w-11 shrink-0' />
                <p>{userLiked?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default page
