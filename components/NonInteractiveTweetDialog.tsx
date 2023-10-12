import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import HeartIconEmpty from './icons/heartEmpty'
import { MessageCircle } from 'lucide-react'

const NonInteractiveTweetDialog = ({ type }: { type: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        {type === 'like' && (
          <HeartIconEmpty className='text-white/40 bg-black' />
        )}
        {type === 'reply' && (
          <MessageCircle size={20} className='text-white/40' />
        )}
        {type === 'replyBtn' && (
          <Button
            type='button'
            className='rounded-full font-bold px-4 !bg-blue-500 !text-white py-3'
          >
            Reply
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-[300px] rounded-2xl !bg-black'>
        <div className=''>
          <h2 className='text-2xl font-bold'>You can't do that … yet</h2>
          <p className='mt-4 mb-6 opacity-50'>
            Communities are public, so you can read the posts — but only members
            can interact with them.
          </p>
        </div>
        <DialogClose>
          <Button className='rounded-full w-full border py-6 font-bold'>
            Got it
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default NonInteractiveTweetDialog
