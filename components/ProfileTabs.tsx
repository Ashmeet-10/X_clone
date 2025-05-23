'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const ProfileTabs = ({ userId }: { userId: string }) => {
  const pathname = usePathname()
  const elementRef = useRef<any>(null)
  const [ref1, inView1] = useInView({ threshold: 0.9 })
  const [ref2, inView2] = useInView({ threshold: 0.9 })
  return (
    <div className='relative group'>
      <div className='overflow-x-hidden'>
        <div className='flex items-center overflow-x-auto scrollbar-hide border-b border-white/30'>
          <div
            className='flex h-14 ease-in-out duration-300 bg-black'
            ref={elementRef}
          >
            <Link
              href={`/profile/${userId}`}
              className='hover:bg-zinc-900 ease-in-out duration-200 px-4 flex justify-center items-center'
              ref={ref1}
            >
              <span
                className={`flex justify-center items-center font-semibold px-1 pt-4 pb-3 h-full border-b-4 ${
                  pathname === `/profile/${userId}/` ||
                  pathname === `/profile/${userId}`
                    ? 'border-blue-500'
                    : 'text-white/50 border-transparent'
                }`}
              >
                Posts
              </span>
            </Link>
            <Link
              href={`/profile/${userId}/following`}
              className='hover:bg-zinc-900 ease-in-out duration-200 px-4 flex justify-center items-center'
            >
              <span
                className={`flex justify-center items-center font-semibold px-1 pt-4 pb-3 h-full border-b-4 ${
                  pathname.includes('following')
                    ? 'border-blue-500'
                    : 'text-white/50 border-transparent'
                }`}
              >
                Following
              </span>
            </Link>
            <Link
              href={`/profile/${userId}/followers`}
              className='hover:bg-zinc-900 ease-in-out duration-200 px-4 flex justify-center items-center'
            >
              <span
                className={`flex justify-center items-center font-semibold px-1 pt-4 pb-3 h-full border-b-4 ${
                  pathname.includes('followers')
                    ? 'border-blue-500'
                    : 'text-white/50 border-transparent'
                }`}
              >
                Followers
              </span>
            </Link>
            <Link
              href={`/profile/${userId}/likes`}
              className='hover:bg-zinc-900 ease-in-out duration-200 px-4 flex justify-center items-center'
              ref={ref2}
            >
              <span
                className={`flex justify-center items-center font-semibold px-1 pt-4 pb-3 h-full border-b-4 ${
                  pathname.includes('likes')
                    ? 'border-blue-500'
                    : 'text-white/50 border-transparent'
                }`}
              >
                Likes
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`hidden absolute top-2 left-2 ${
          !inView1 && 'group-hover:block'
        }`}
      >
        <Button
          className={` !bg-gray-600 !text-white rounded-full w-10 h-10 !px-0 !py-0 `}
          onClick={() =>
            elementRef.current.scrollIntoView({
              behavior: 'smooth',
              inline: 'start',
              block: 'nearest',
            })
          }
        >
          <ArrowLeft size={20} />
        </Button>
      </div>
      <div
        className={`hidden absolute top-2 right-0 ${
          !inView2 && 'group-hover:block'
        }`}
      >
        <Button
          className={` !bg-gray-600 !text-white rounded-full w-10 h-10 !px-0 !py-0 `}
          onClick={() =>
            elementRef.current.scrollIntoView({
              behavior: 'smooth',
              inline: 'end',
              block: 'nearest',
            })
          }
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}

export default ProfileTabs
