import AccountProfile from '@/components/Forms/AccountProfile'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const page = async () => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const userInfo = await User.findOne({ id: currentUserData.id }).select('name username bio image onboarded')
  if (userInfo?.onboarded) redirect('/')
  const userData = {
    id: currentUserData.id,
    name: userInfo ? userInfo?.name : currentUserData.firstName + ' ' + currentUserData.lastName,
    username: userInfo ? '@' + userInfo?.username : '@' + currentUserData.username,
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : currentUserData.imageUrl,
  }
  return (
    <div className='m-6'>
      <AccountProfile user={userData} />
    </div>
  )
}

export default page
