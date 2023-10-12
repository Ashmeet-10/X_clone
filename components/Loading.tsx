import { cn } from '@/lib/utils'
import Image from 'next/image'

const Loading = ({ className }: { className: string }) => {
  return (
    <div className={cn('flex justify-center', className)}>
      <Image
        src='/loading.svg'
        alt='Loading...'
        width={50}
        height={50}
        className='animate-spin'
      />
    </div>
  )
}

export default Loading
