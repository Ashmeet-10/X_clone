import HomeTabs from '@/components/HomeTabs'
import LeftSidebar from '@/components/LeftSidebar'
import Loading from '@/components/Loading'
import { unstable_noStore } from 'next/cache'
import Image from 'next/image'
import { Suspense } from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  unstable_noStore()
  return (
    <div>
      <div className='flex px-4 w-full h-16 justify-center items-center z-20 xs:hidden'>
        <div className='w-1/2 flex items-center'>
          <LeftSidebar />
        </div>
        <div className='w-8 aspect-square relative'>
          <Image src='/assets/X_logo.svg' alt='logo' fill />
        </div>
        <div className='w-1/2' />
      </div>
      <div className='z-20 px-4 h-16 hidden xs:sticky xs:top-0 xs:left-0 xs:flex xs:items-center xs:bg-black/60 xs:backdrop-blur-md'>
        <h2 className='text-2xl font-semibold'>Home</h2>
      </div>
      <HomeTabs />
      <Suspense fallback={<Loading className='items-start mt-4' />}>
        {children}
      </Suspense>
    </div>
  )
}

export default HomeLayout
