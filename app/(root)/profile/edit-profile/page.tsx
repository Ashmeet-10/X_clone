import AccountProfile from '@/components/AccountProfile'
import BackButton from '@/components/BackButton'
import { fetchUser } from '@/lib/actions/userActions'
import { currentUser } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'

const page = async () => {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await fetchUser(user.id)
  const userData = {
    id: user.id,
    name: userInfo ? userInfo?.name : user.firstName + ' ' + user.lastName,
    username: userInfo ? userInfo?.username : user.username,
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  }
  return (
    <div className=''>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Edit profile</span>
      </div>
      <div className='m-6'>
        <AccountProfile user={userData} />
      </div>
    </div>
  )
}

export default page
