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
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { usePathname, useRouter } from 'next/navigation'
import { communityValidation } from '@/lib/validations/communityValidation'
import { Textarea } from '../ui/textarea'
import { createCommunity } from '@/lib/actions/communityActions'

const CommunityForm = () => {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('media')
  const pathname = usePathname()
  const form = useForm<z.infer<typeof communityValidation>>({
    resolver: zodResolver(communityValidation),
    defaultValues: {
      name: '',
      purpose: '',
      rules: '',
      image: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof communityValidation>) => {
    const blob = values.image

    const hasImageChanged = isBase64Image(blob)
    if (hasImageChanged) {
      const imgRes = await startUpload(files)

      if (imgRes && imgRes[0].url) {
        values.image = imgRes[0].url
      }
    }

    await createCommunity({
      name: values.name,
      purpose: values.purpose,
      rules: values.rules,
      image: values.image,
    })
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
            <FormItem>
              <FormLabel>Community Profile Image</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              {field.value && (
                <div className='relative w-full aspect-video'>
                  <Image
                    src={field.value}
                    alt='community profile image'
                    fill
                    className='object-cover rounded-lg'
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Name'
                  className='focus:!ring-2 focus:!ring-blue-500'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Name must be between 3 and 30 characters and can't include
                hastags or @usernames
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='purpose'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Purpose</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Purpose'
                  className='focus:!ring-2 focus:!ring-blue-500'
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A strong purpose describes your Community and lets people know
                what to expect.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='rules'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community Rules</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Rules'
                  className='focus:!ring-2 focus:!ring-blue-500'
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Rules help people respect your Community's purpose and each
                other.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='!bg-sky-500 hover:!bg-sky-600 !text-white'
          type='submit'
        >
          Create
        </Button>
      </form>
    </Form>
  )
}

export default CommunityForm
