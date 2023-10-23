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
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { tweetValidation } from '@/lib/validations/tweetValidation'
import { createReply } from '@/lib/actions/tweetActions'
import { Input } from '../ui/input'
import NonInteractiveTweetDialog from '../Dialogs/NonInteractiveTweetDialog'

type Props = {
  user: {
    image: string
  }
  tweetId: string
  interactiveTweet: boolean
}

const ReplyForm = ({ user, tweetId, interactiveTweet }: Props) => {
  const form = useForm({
    resolver: zodResolver(tweetValidation),
    defaultValues: {
      tweet: '',
      viewer: 'Everyone',
    },
  })

  const onSubmit = async (values: z.infer<typeof tweetValidation>) => {
    await createReply({
      text: values.tweet,
      tweetId: tweetId,
    })
    form.reset()
  }
  
  return (
    <Form {...form}>
      <div className='flex'>
        <div className='w-10 h-10 relative shrink-0'>
          <Image
            src={user.image}
            alt='profile photo'
            fill
            className='rounded-full'
          />
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex items-center justify-between w-full'
        >
          <FormField
            control={form.control}
            name='tweet'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    placeholder='Post your reply!'
                    className='!bg-black text-xl !border-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className={`rounded-full font-bold px-4 hover:!bg-blue-600 !text-white !bg-blue-500 py-3 ${!interactiveTweet && 'hidden'}`}
          >
            Reply
          </Button>
          {!interactiveTweet && (
            <NonInteractiveTweetDialog type='replyBtn' />
          )}
        </form>
      </div>
    </Form>
  )
}

export default ReplyForm
