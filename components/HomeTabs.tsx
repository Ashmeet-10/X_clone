'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const HomeTabs = () => {
  const pathname = usePathname()
  return (
    <div className='z-20 flex h-14 border-b border-white/30 sticky top-0 left-0 ease-in-out duration-300 bg-black/60 backdrop-blur-md xs:top-16'>
      <Link
        href='/'
        className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
      >
        <span
          className={`flex justify-center items-center h-full border-b-4 ${
            pathname.includes('following')
              ? 'text-white/50 border-transparent'
              : 'font-semibold border-blue-500'
          }`}
        >
          For you
        </span>
      </Link>
      <Link
        href='/following'
        className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
      >
        <span
          className={`flex justify-center items-center h-full border-b-4 ${
            pathname.includes('following')
              ? 'font-semibold border-blue-500'
              : 'text-white/50 border-transparent'
          }`}
        >
          Following
        </span>
      </Link>
    </div>
  )
}

export default HomeTabs
