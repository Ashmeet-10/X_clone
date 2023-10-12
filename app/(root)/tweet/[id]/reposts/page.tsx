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
  const tweetInfo = Tweet.findById(params.id).populate('repostedBy')
  const [user, tweet] = await Promise.all([userInfo, tweetInfo])
  return (
    <div className=''>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Reposted by</span>
      </div>
      {tweet.repostedBy.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No Reposts yet</h1>
          <p className='text-white/50 mt-4'>
            You will find a list of everyone who reposted this post here.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          {tweet?.repostedBy.map((userReposted: any) => (
            <div className='py-4'>
              <div className='flex items-center space-x-4'>
                <ProfileHoverCard author={userReposted} />
                <div className='flex justify-between items-center space-x-2 w-full'>
                  <div className=''>
                    <p className='font-bold line-clamp-1 text-lg'>
                      {userReposted?.name}
                    </p>
                    <p className='opacity-50 line-clamp-1'>
                      {userReposted?.username}
                    </p>
                  </div>
                  <FollowButton
                    userId={userReposted?.id}
                    followed={user.following.includes(userReposted._id)}
                  />
                </div>
              </div>
              <div className='flex my-1 font-medium space-x-4'>
                <div className='w-11 shrink-0' />
                <p>{userReposted?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default page
