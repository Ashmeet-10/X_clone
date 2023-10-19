'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

const PostButton = () => {
  const pathname = usePathname()
  if (pathname === '/compose/tweet' || pathname === '/profile/edit-profile' || pathname === '/communities/create' || pathname.startsWith('/tweet'))
    return null
  return (
    <Link href='/compose/tweet' className='fixed bottom-20 z-20 right-6'>
      <Button className='mt-4 !bg-blue-500 hover:!bg-blue-600 ease-in-out duration-200 !text-white'>
        Post
      </Button>
    </Link>
  )
}

export default PostButton
