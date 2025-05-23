import AccountProfile from '@/components/Forms/AccountProfile'
import { currentUser } from '@clerk/nextjs/server'

const page = async () => {
  const user = await currentUser()
  if (!user) return null
  const userData = {
    id: user?.id,
    name: user?.fullName || '',
    username: '@' + user?.username,
    bio: '',
    image: user?.imageUrl,
  }
  return (
    <div className='m-6'>
      <AccountProfile user={userData} />
    </div>
  )
}

export default page
