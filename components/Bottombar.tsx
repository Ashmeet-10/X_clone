import { Bell, Home, Mail, Search } from 'lucide-react'
import Link from 'next/link'

const Bottombar = () => {
  return (
    <div className='fixed bottom-0 w-full border-t border-white/40 bg-black'>
      <div className='flex items-center justify-between p-4'>
        <Link href='/'>
          <Home size={28} />
        </Link>
        <Link href='/search'>
          <Search size={28} />
        </Link>
        <Link href='/notifications'>
          <Bell size={28} />
        </Link>
        <Mail size={28} />
      </div>
    </div>
  )
}

export default Bottombar
