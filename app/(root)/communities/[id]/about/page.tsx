import Loading from '@/components/Loading'
import UsersList from '@/components/UsersList'
import Community from '@/lib/models/community'
import User from '@/lib/models/user'
import { connectToDB } from '@/lib/mongoose'
import { currentUser } from '@clerk/nextjs'
import { CalendarDays, Globe, Users } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const AboutCommunity = async ({ params }: { params: { id: string } }) => {
  await connectToDB()
  const communityInfo = Community.findById(params.id)
    .select('rules createdBy members createdAt')
    .populate({
      path: 'members',
      select: 'name username image id following followers bio',
    })
    .populate({
      path: 'createdBy',
      select: 'name username image id following followers bio',
    })
  const currentUserInfo = currentUser()
  const [community, currentuser] = await Promise.all([
    communityInfo,
    currentUserInfo,
  ])
  console.log(community)
  if (!currentuser) return null
  const user = await User.findOne({ id: currentuser.id }).select('following')
  return (
    <div className=''>
      <div className='border-b border-white/30 p-4'>
        <h2 className='text-2xl font-bold mb-6'>Community Info</h2>
        <div className='space-y-6'>
          <div className='flex space-x-5'>
            <Users className='w-7 h-7 opacity-50 shrink-0' />
            <p>Only members can post, like, or reply.</p>
          </div>
          <div className='flex space-x-5'>
            <Globe className='w-7 h-7 opacity-50 shrink-0' />
            <div className=''>
              <p className='font-bold'>All Communities are publicly visible.</p>
              <p className='opacity-50'>Anyone can join this Community.</p>
            </div>
          </div>
          <div className='flex space-x-5'>
            <CalendarDays className='w-7 h-7 opacity-50 shrink-0' />
            <span className='text-white/50'>
              Created {community.createdAt.toDateString()} by{' '}
              <span className='text-white'>{community.createdBy.username}</span>
            </span>
          </div>
        </div>
      </div>

      <div className='border-b border-white/30 px-4 pt-4'>
        <h2 className='text-2xl font-bold mb-6'>Rules</h2>
        <p className='mb-6 opacity-90'>
          These are set and enforced by Community admins and are in addition to
          Twitter's rules.
        </p>
        <p className='whitespace-pre-line'>{community.rules}</p>
        <div className='mt-6'>
          <h2 className='text-2xl font-bold'>Moderator</h2>
          <UsersList users={[community.createdBy]} currentUser={user} />
        </div>
      </div>

      <div className='border-b border-white/30 p-4'>
        <h2 className='text-2xl font-bold mb-6'>Members</h2>
        <UsersList users={community.members} currentUser={user} />
      </div>
    </div>
  )
}

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className='flex h-14 border-b border-white/30 ease-in-out duration-300'>
        <Link
          href={`/communities/${params.id}`}
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='flex text-white/50 justify-center items-center h-full border-b-4 border-transparent'>
            Posts
          </span>
        </Link>
        <Link
          href={`/communities/${params.id}/about`}
          className='w-1/2 hover:bg-zinc-900 ease-in-out duration-200 flex justify-center items-center'
        >
          <span className='border-b-4 border-blue-500 flex font-semibold justify-center items-center h-full'>
            About
          </span>
        </Link>
      </div>
      <Suspense
        fallback={<Loading className='min-h-[60vh] items-start mt-4' />}
      >
        <div className='min-h-[60vh]'>
          <AboutCommunity params={params} />
        </div>
      </Suspense>
    </>
  )
}

export default page
