import { Bell, Bookmark, Home, LogOutIcon, Mail, Search, User2, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { SignOutButton } from '@clerk/nextjs'
import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'

const ProfileLink = async () => {
  const currentuser = await currentUser()
  if (!currentuser) return null
  return (
    <Link
      href={`/profile/${currentuser.id}`}
      className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
    >
      <User2 className='w-7 h-7 stroke-[2.5px]' />
      <span className='text-[22px] hidden xl:block'>Profile</span>
    </Link>
  )
}

const LeftMenu = () => {
  return (
    <div className='relative w-20 xl:w-[270px]'>
      <div className='absolute top-0 left-0'>
        <div className='fixed h-screen overflow-y-scroll scrollbar-hide flex flex-col items-center space-y-1 p-2 xl:px-4 xl:items-stretch'>
          <Link href='/'>
            <div className='p-4 xl:p-5 hover:bg-zinc-900 w-fit rounded-full'>
              <div className='w-7 aspect-square rounded-full hover:bg-zinc-900 relative'>
                <Image src='/assets/X_logo.svg' alt='logo' fill />
              </div>
            </div>
          </Link>
          <Link
            href='/'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Home className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Home</span>
          </Link>
          <Suspense>
            <ProfileLink />
          </Suspense>
          <Link
            href='/communities'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Users className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Communities</span>
          </Link>
          <Link
            href='/search'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Search className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Explore</span>
          </Link>
          <Link
            href='/bookmarks'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Bookmark className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Bookmarks</span>
          </Link>
          <Link
            href='/notifications'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Bell className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Notifications</span>
          </Link>
          <Link
            href='/'
            className='flex space-x-6 items-center rounded-full hover:bg-zinc-900 p-4 ease-in-out duration-300 xl:px-5'
          >
            <Mail className='w-7 h-7 stroke-[2.5px]' />
            <span className='text-[22px] hidden xl:block'>Messages</span>
          </Link>
          <Link
            href='/compose/tweet'
            className='hidden sm:block sm:py-4 xl:hidden'
          >
            <Button className='rounded-lg !p-3 text-sm font-bold !bg-blue-500 hover:!bg-blue-600 ease-in-out duration-200 !text-white'>
              Post
            </Button>
          </Link>
          <Link href='/compose/tweet' className='hidden xl:block'>
            <Button className='mt-4 mb-2 rounded-full w-full !py-7 text-xl font-bold !bg-blue-500 hover:!bg-blue-600 ease-in-out duration-200 !text-white'>
              Post
            </Button>
          </Link>
          <div className='hidden xs:block xs:py-4 xl:hidden'>
            <SignOutButton>
              <Button
                variant='outline'
                className='rounded-lg !border !border-white/50 !p-3 text-sm font-bold ease-in-out duration-200'
              >
                <LogOutIcon className='w-7 h-5 stroke-2' />
              </Button>
            </SignOutButton>
          </div>
          <div className='hidden xl:block'>
            <SignOutButton>
              <Button
                variant='outline'
                className='mt-4 rounded-full !text-white w-full !py-7 text-xl ease-in-out duration-200'
              >
                Logout
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftMenu
