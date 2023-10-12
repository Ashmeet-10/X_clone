import BackButton from '@/components/BackButton'
import Loading from '@/components/Loading'
import SearchBar from '@/components/SearchBar'
import Community from '@/lib/models/community'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

const Communities = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  let communities = []
  if (searchParams.q) {
    communities = await Community.find({
      name: { $regex: searchParams.q, $options: 'i' },
    }).select('name profileImage members')
  } else
    communities = await Community.find({}).select('name profileImage members')
  return (
    <div className=''>
      {communities.length === 0 ? (
        <div className='mx-6 mt-8 space-y-4'>
          <h1 className='text-4xl font-extrabold opacity-90'>
            No results for "{searchParams.q}"
          </h1>
          <p className='opacity-50'>
            The term you entered did not bring up any results. Try a different
            search term.
          </p>
        </div>
      ) : (
        <div className='p-4 space-y-4'>
          {communities.map((community, idx) => (
            <Link key={idx} href={`/communities/${community._id}`}>
              <div className='flex space-x-4 py-2 items-center'>
                <div className='relative w-24 h-24 shrink-0'>
                  <Image
                    src={community.profileImage}
                    fill
                    className='rounded-xl object-cover'
                    alt='community profile image'
                  />
                </div>
                <div className=''>
                  <p className='font-bold line-clamp-1'>{community.name}</p>
                  <p className='line-clamp-1 space-x-1'>
                    <span className='font-bold'>
                      {community.members.length}
                    </span>
                    <span className='opacity-50'>members</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  return (
    <div className=''>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <BackButton />
        <span>Discover Communities</span>
      </div>
      <SearchBar community={true} />
      <Suspense fallback={<Loading className='min-h-[90vh] items-start' />}>
        <Communities searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

export default page
