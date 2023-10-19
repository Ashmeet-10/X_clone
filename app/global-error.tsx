'use client'

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.log(error)
  return (
    <html>
      <body>
        <div className='flex flex-col min-h-[80vh] space-y-4 items-center justify-center'>
          <h2 className='mx-2 text-xl'>Something went wrong</h2>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  )
}
