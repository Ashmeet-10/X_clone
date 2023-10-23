import AccountProfile from '@/components/Forms/AccountProfile'
import User from '@/lib/models/user'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await User.findOne({ id: user.id }).select('name username bio image onboarded')
  if (userInfo?.onboarded) redirect('/')
  const userData = {
    id: user.id,
    name: userInfo ? userInfo?.name : user.firstName + ' ' + user.lastName,
    username: userInfo ? '@' + userInfo?.username : '@' + user.username,
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  }
  return (
    <div className='m-6'>
      <AccountProfile user={userData} />
    </div>
  )
}

export default page
