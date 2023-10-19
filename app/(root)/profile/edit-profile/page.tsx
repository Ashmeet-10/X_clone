import AccountProfile from '@/components/Forms/AccountProfile'
import BackButton from '@/components/Buttons/BackButton'
import Loading from '@/components/Loading'
import User from '@/lib/models/user'
import { currentUser } from '@clerk/nextjs'
import { Suspense } from 'react'

const EditProfile = async () => {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await User.findOne({ id: user.id }).select('name username bio image onboarded')
  const userData = {
    id: user.id,
    name: userInfo ? userInfo?.name : user.firstName + ' ' + user.lastName,
    username: userInfo ? userInfo?.username : user.username,
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  }
  return (
    <div className='m-6'>
      <AccountProfile user={userData} />
    </div>
  )
}

const page = () => {
  return (
    <div>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Edit profile</span>
      </div>
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        <EditProfile />
      </Suspense>
    </div>
  )
}

export default page
