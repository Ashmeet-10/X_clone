'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { userValidation } from '@/lib/validations/userValidation'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { usePathname, useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/userActions'
import { Textarea } from '../ui/textarea'

type Props = {
  user: {
    name: string
    username: string
    bio: string
    id: string
    image: string
  }
}

const AccountProfile = ({ user }: Props) => {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('media')
  const pathname = usePathname()
  const form = useForm({
    resolver: zodResolver(userValidation),
    defaultValues: {
      name: user.name || '',
      username: user.username.slice(1) || '',
      bio: user.bio || '',
      image: user.image || '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    const blob = values.image

    const hasImageChanged = isBase64Image(blob)
    if (hasImageChanged) {
      const imgRes = await startUpload(files)

      if (imgRes && imgRes[0].url) {
        values.image = imgRes[0].url
      }
    }

    await updateUser({
      name: values.name,
      username: `@${values.username}`,
      bio: values.bio,
      image: values.image,
    })

    if (pathname === '/profile/edit') router.back()
    else router.push('/')
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFiles(Array.from(e.target.files))

      if (!file.type.includes('image')) return

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ''
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex items-center'>
              <FormLabel>
                <div className='relative w-20 aspect-square'>
                  <Image
                    src={field.value}
                    fill
                    alt='profile photo'
                    className='rounded-full object-cover'
                  />
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='!bg-black !text-blue-500 border-none cursor-pointer'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Name'
                  className='focus:!ring-2 focus:!ring-blue-500'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder='example123'
                  className='focus:!ring-2 focus:!ring-blue-500'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='bio'
                  rows={3}
                  className='focus:!ring-2 focus:!ring-blue-500'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='rounded-full w-full font-bold px-4 py-3'
        >
          Save
        </Button>
      </form>
    </Form>
  )
}

export default AccountProfile
