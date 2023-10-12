import LeftSidebar from '@/components/LeftSidebar'

const page = () => {
  return (
    <div>
      <div className='flex space-x-10 p-4 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 text-lg items-center'>
        <LeftSidebar />
        <span>Notifications</span>
      </div>
    </div>
  )
}

export default page
