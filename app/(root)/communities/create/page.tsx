import BackButton from '@/components/BackButton'
import CommunityForm from '@/components/CommunityForm'
import Loading from '@/components/Loading'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { Suspense } from 'react'

const page = () => {
  return (
    <div>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Create a Community</span>
      </div>
      <div className='m-4'>
        <Suspense fallback={<Loading className='min-h-[90vh] items-start' />}>
          <CommunityForm />
        </Suspense>
      </div>
    </div>
  )
}

export default page
