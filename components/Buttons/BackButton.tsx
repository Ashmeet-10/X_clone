'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

const BackButton = () => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      className='m-0 p-0 !bg-transparent !text-white'
    >
      <ArrowLeft className='w-6 h-6' />
    </Button>
  )
}

export default BackButton
