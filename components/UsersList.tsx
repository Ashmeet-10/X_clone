import FollowButton from './FollowButton'
import ProfileHoverCard from './ProfileHoverCard'

const UsersList = ({ users, currentUser }: any) => {
  return (
    <div>
      {users.map((user: any) => (
        <div className='py-4'>
          <div className='flex items-center space-x-2'>
            <ProfileHoverCard author={user} />
            <div className='flex justify-between items-center space-x-2 w-full'>
              <div className=''>
                <p className='font-bold line-clamp-1 text-lg'>{user?.name}</p>
                <p className='opacity-50 line-clamp-1'>{user?.username}</p>
              </div>
              {currentUser._id?.toString() !== user._id?.toString() && (
                <FollowButton
                  userId={user?.id}
                  followed={currentUser.following.includes(user._id)}
                />
              )}
            </div>
          </div>
          <div className='flex my-1 font-medium space-x-2'>
            <div className='w-11 shrink-0' />
            <p>{user?.bio}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UsersList
