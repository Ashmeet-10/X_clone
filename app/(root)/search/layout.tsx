import BackButton from '@/components/BackButton'
import Loading from '@/components/Loading'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import { Suspense } from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Search</span>
      </div>
      <SearchBar />

      <Suspense fallback={<Loading className='min-h-[90vh] items-start' />}>
        {children}
      </Suspense>
    </>
  )
}

export default Layout
