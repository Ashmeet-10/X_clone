import BackButton from '@/components/Buttons/BackButton'
import LeftSidebar from '@/components/LeftSidebar'

const page = () => {
  return (
    <>
      <div className='flex space-x-10 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 p-4 text-lg items-center'>
        <BackButton />
        <span>Notifications</span>
      </div>
      <div className='m-8'>
        <h1 className='text-4xl font-bold'>No Notifications for now</h1>
      </div>
    </>
  )
}

export default page
