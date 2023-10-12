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
  const tweetInfo = Tweet.findById(params.id).populate('quotedBy')
  const [user, tweet] = await Promise.all([userInfo, tweetInfo])
  return (
    <div className=''>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Quoted by</span>
      </div>
      {tweet.quotedBy.length === 0 ? (
        <div className='m-8'>
          <h1 className='text-4xl font-bold'>No Quotes yet</h1>
          <p className='text-white/50 mt-4'>
            You will find a list of everyone who quoted this post here.
          </p>
        </div>
      ) : (
        <div className='m-4'>
          {tweet?.quotedBy.map((userQuoted: any) => (
            <div className='py-4'>
              <div className='flex items-center space-x-4'>
                <ProfileHoverCard author={userQuoted} />
                <div className='flex justify-between items-center space-x-2 w-full'>
                  <div className=''>
                    <p className='font-bold line-clamp-1 text-lg'>
                      {userQuoted?.name}
                    </p>
                    <p className='opacity-50 line-clamp-1'>
                      {userQuoted?.username}
                    </p>
                  </div>
                  <FollowButton
                    userId={userQuoted?.id}
                    followed={user.following.includes(userQuoted._id)}
                  />
                </div>
              </div>
              <div className='flex my-1 font-medium space-x-4'>
                <div className='w-11 shrink-0' />
                <p>{userQuoted?.bio}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default page
