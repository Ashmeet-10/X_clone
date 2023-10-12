import AccountProfile from '@/components/AccountProfile'
import { fetchUser } from '@/lib/actions/userActions'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await currentUser()
  if (!user) return null
  const userInfo = await fetchUser(user.id)
  if (userInfo?.onboarded) redirect('/')
  const userData = {
    id: user.id,
    name: userInfo ? userInfo?.name : user.firstName + ' ' + user.lastName,
    username: userInfo ? '@'+userInfo?.username : '@'+user.username,
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
