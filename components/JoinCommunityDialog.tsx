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
import JoinCommunityButton from './JoinCommunityButton'

type Props = {
  community: {
    _id: Object
    name: string
    purpose: string
    rules: string
    createdBy: Object
    posts: Object[]
    members: Object[]
    profileImage: string
    createdAt: Object
  }
}

const JoinCommunityDialog = ({ community }: Props) => {
  console.log(community)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='font-extrabold rounded-full'>
          Join
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[425px] !bg-black'>
        <DialogHeader>
          <DialogTitle>{community.name} Rules</DialogTitle>
        </DialogHeader>
        <div className=''>
          <h2 className='text-2xl font-bold'>
            Review and agree to {community.name} Rules
          </h2>
          <p className='mt-4 mb-6 opacity-50'>
            These are set and enforced by Community admins and are in addition
            to Twitter’s rules.
          </p>
          <div className='whitespace-pre-line font-bold opacity-80'>
            {community.rules}
          </div>
        </div>
        <DialogClose>
          <JoinCommunityButton communityId={community._id.toString()} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default JoinCommunityDialog
