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
import DeleteTweetButton from './DeleteTweetButton'
import { Trash2 } from 'lucide-react'

const DeleteTweetDialog = ({ tweetId }: { tweetId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex justify-center items-center space-x-2 font-semibold text-lg cursor-pointer text-red-600 hover:!text-red-600'>
          <Trash2 size={22} />
          <p>Delete</p>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[300px] rounded-2xl !bg-black'>
        <div className=''>
          <h2 className='text-2xl font-bold'>Delete post?</h2>
          <p className='mt-4 mb-6 opacity-50'>
            This can't be undone and it will be removed from your profile, the
            timeline of any accounts that follow you, and from search results.
          </p>
        </div>
        <DialogClose>
          <DeleteTweetButton tweetId={tweetId} />
        </DialogClose>
        <DialogClose>
          <Button className='rounded-full w-full border py-6 border-white/30 font-bold !bg-black !text-white'>
            Cancel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTweetDialog
