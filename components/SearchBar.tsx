'use client'

import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'
import { ChangeEvent } from 'react'

const SearchBar = ({ community }: { community?: boolean }) => {
  const router = useRouter()
  return (
    <div className='m-4 px-4 rounded-full flex items-center border-2 border-white/30 overflow-hidden focus-within:border-sky-500'>
      <Search className='w-6 h-6' />
      <Input
        placeholder={`${community ? 'Search Communities' : 'Search'}`}
        className='!bg-black !border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (event.target.value) {
            community
              ? router.push(`/communities/search?q=${event.target.value}`)
              : router.push(`/search?q=${event.target.value}`)
          } else {
            community
              ? router.push(`/communities/search`)
              : router.push(`/search`)
          }
        }}
      />
    </div>
  )
}

export default SearchBar
