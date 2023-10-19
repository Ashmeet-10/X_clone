import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import UnfollowButton from '../Buttons/UnfollowButton'

const UnfollowUserDialog = ({ userId }: { userId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='font-extrabold rounded-full'>Following</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[300px] rounded-2xl !bg-black'>
        <div className=''>
          <h2 className='text-2xl font-bold'>Unfollow @user?</h2>
          <p className='mt-4 mb-6 opacity-50'>
            Their posts will no longer show up in your For You timeline. You can
            still view their profile, unless their posts are protected.
          </p>
        </div>
        <DialogClose>
          <UnfollowButton userId={userId} />
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

export default UnfollowUserDialog
