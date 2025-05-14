import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignOutButton, currentUser } from '@clerk/nextjs'
import { Bookmark, Settings, User2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'

const LeftSidebar = async () => {
  const connectDbPromise = connectToDB()
  const currentUserPromise = currentUser()
  const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
  if (!currentUserData) return null
  const userInfo = await User.findOne({ id: currentUserData.id }).select('name username id image following followers')

  return (
    <Sheet>
      <SheetTrigger>
        <div className='relative w-8 h-8 flex items-center'>
          <Image
            src={userInfo?.image || currentUserData.imageUrl}
            fill
            className='rounded-full'
            alt='profile-photo'
          />
        </div>
      </SheetTrigger>
      <SheetContent side='left' className='!bg-black px-0'>
        <div className='flex flex-col h-full'>
          <Link href={`/profile/${currentUserData.id}`} className='px-4'>
            <div className='relative w-14 aspect-square flex items-center'>
              <Image
                src={userInfo?.image || currentUserData.imageUrl}
                fill
                className='rounded-full'
                alt='profile-photo'
              />
            </div>
            <p className='text-xl font-bold mt-2'>{userInfo.name}</p>
            <p className='text-white/50'>{userInfo.username}</p>
          </Link>
          <div className='text-white/50 mt-3 mb-5 px-4 flex space-x-3 text-sm'>
            <Link href={`/profile/${userInfo.id}/following`}>
              <span className='text-white'>{userInfo.following.length}</span>{' '}
              Following
            </Link>
            <Link href={`/profile/${userInfo.id}/followers`}>
              <span className='text-white'>{userInfo.followers.length}</span>{' '}
              Followers
            </Link>
          </div>
          <div className='flex flex-col text-xl font-bold'>
            <Link
              href={`/profile/${currentUserData.id}`}
              className='flex items-center space-x-6 hover:bg-zinc-900 p-4 ease-in-out duration-200'
            >
              <User2 size={25} />
              <span>Profile</span>
            </Link>
            <Link
              href='/communities'
              className='flex items-center space-x-6 hover:bg-zinc-900 p-4 ease-in-out duration-200'
            >
              <Users size={25} />
              <span>Communities</span>
            </Link>
            <Link
              href='/bookmarks'
              className='flex items-center space-x-6 hover:bg-zinc-900 p-4 ease-in-out duration-200'
            >
              <Bookmark size={25} />
              <span>Bookmarks</span>
            </Link>
            <Link
              href='/'
              className='flex items-center space-x-6 hover:bg-zinc-900 p-4 ease-in-out duration-200'
            >
              <Settings size={25} />
              <span>Settings</span>
            </Link>
          </div>
          <div className='mt-10 px-4'>
            <SignOutButton>
              <Button className='flex items-center space-x-3 font-semibold'>
                Log out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default LeftSidebar
