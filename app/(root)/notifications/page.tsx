import BackButton from '@/components/Buttons/BackButton'

const page = () => {
  return (
    <>
      <div className='flex space-x-10 font-bold sticky top-0 z-10 bg-black/80 backdrop-blur-md left-0 p-4 text-lg items-center'>
        <BackButton />
        <span>Notifications</span>
      </div>
      <div className='m-8'>
        <h1 className='text-4xl font-bold'>Nothing to see here — yet</h1>
        <p className='text-white/50 mt-4'>
          From likes to reposts and a whole lot more, this is where all the
          action happens.
        </p>
      </div>
    </>
  )
}

export default page
