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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { tweetValidation } from '@/lib/validations/tweetValidation'
import { Textarea } from '../ui/textarea'
import {
  createCommunityTweet,
  createTweet,
  quoteTweet,
  quoteTweetInCommunity,
} from '@/lib/actions/tweetActions'
import { Globe } from 'lucide-react'
import BackButton from '../Buttons/BackButton'

type Props = {
  user: {
    image: string
    id: string
  }
  tweet?: any
  communities?: any
}

const TweetForm = ({ user, tweet, communities }: Props) => {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(tweetValidation),
    defaultValues: {
      tweet: '',
      viewer: 'Everyone',
    },
  })

  const onSubmit = async (values: z.infer<typeof tweetValidation>) => {
    const communityId = communities
      ?.find((community: any) => community.name === values.viewer)
      ?._id.toString()
    if (values.viewer !== 'Everyone') {
      if (tweet) {
        await quoteTweetInCommunity({
          text: values.tweet,
          quotedTweetId: tweet._id,
          communityId: communityId,
        })
      } else {
        await createCommunityTweet({
          text: values.tweet,
          communityName: values.viewer,
        })
      }
      router.push('/communities')
    } else {
      if (tweet) {
        await quoteTweet({
          text: values.tweet,
          quotedTweetId: tweet._id,
        })
      } else {
        await createTweet({
          text: values.tweet,
        })
      }
      router.push('/')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex justify-between items-center mb-6'>
          <BackButton />
          <Button
            type='submit'
            className='rounded-full font-bold px-4 hover:!bg-blue-400 !text-white !bg-blue-500 py-3'
          >
            Post
          </Button>
        </div>
        <div className='flex space-x-4'>
          <div className='w-11 h-11 relative shrink-0'>
            <Image
              src={user.image}
              alt='profile photo'
              fill
              className='rounded-full'
            />
          </div>
          <div className='space-y-8'>
            <FormField
              control={form.control}
              name='viewer'
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='!bg-black !text-sky-500 !border !border-sky-500 h-7 w-36 rounded-full font-semibold !ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'>
                        <SelectValue placeholder='Choose your audience' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='!bg-black p-4'>
                      <p className='text-2xl font-bold mb-4'>Choose audience</p>
                      <SelectItem
                        className='font-semibold my-4 border border-white/40 rounded-md'
                        value='Everyone'
                      >
                        Everyone
                      </SelectItem>
                      <span className='text-xl !my-4'>My Communities</span>
                      {communities?.length === 0 ? (
                        <p className='opacity-50'>
                          You are not in any community
                        </p>
                      ) : (
                        <>
                          {communities?.map((community: any, idx: number) => (
                            <SelectItem
                              className='font-semibold mt-2 border border-white/40 rounded-md line-clamp-1'
                              value={`${community.name}`}
                            >
                              {community.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tweet'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={
                        tweet ? 'Add a Comment!' : 'What is happening?'
                      }
                      className='!bg-black text-2xl p-0 !border-0 !ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {tweet ? (
              <div className='border border-white/30 rounded-2xl p-4'>
                <div className='flex items-center space-x-2'>
                  <div className='relative w-9 h-9 shrink-0'>
                    <Image
                      src={tweet.author.image}
                      alt='user photo'
                      fill
                      className='rounded-full'
                    />
                  </div>
                  <div className=''>
                    <p className='font-bold line-clamp-1'>
                      {tweet.author.name}
                    </p>
                    <p className='opacity-50 line-clamp-1'>
                      {tweet.author.username}
                    </p>
                  </div>
                </div>
                <div className='whitespace-pre-line mt-2'>{tweet.text}</div>
              </div>
            ) : null}
          </div>
        </div>
        <p className='flex items-center ml-2 mt-4 space-x-2 text-sky-500'>
          <Globe className='w-4 h-4' />
          <span className='font-semibold text-sm'>
            {form.getValues('viewer') === 'Everyone'
              ? 'Everyone can Reply'
              : 'Community members can Reply'}
          </span>
        </p>
      </form>
    </Form>
  )
}

export default TweetForm
