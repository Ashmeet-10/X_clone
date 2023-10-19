'use client'

import { Button } from '@/components/ui/button'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  console.log(error)
  return (
    <div className='flex flex-col min-h-[80vh] space-y-4 items-center justify-center'>
      <h2 className='mx-2 text-xl text-center'>Error searching users</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}

export default Error
