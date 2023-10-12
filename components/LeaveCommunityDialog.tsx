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
import LeaveCommunityButton from './LeaveCommunityButton'

const LeaveCommunityDialog = ({
  communityName,
  communityId,
}: {
  communityName: string
  communityId: string
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='font-extrabold rounded-full'>Leave</Button>
      </DialogTrigger>
      <DialogContent className='max-w-[300px] rounded-2xl !bg-black'>
        <div className=''>
          <h2 className='text-2xl font-bold'>
            Are you sure to leave {communityName}
          </h2>
          <p className='mt-4 mb-6 opacity-50'>
            You'll lose access to the Community and will no longer be able to
            participate, but your previous Tweets will still be visible.
          </p>
        </div>
        <DialogClose>
          <LeaveCommunityButton communityId={communityId} />
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

export default LeaveCommunityDialog
