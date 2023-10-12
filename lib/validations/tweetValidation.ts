import * as z from 'zod'

export const tweetValidation = z.object({
  tweet: z.string().min(3, { message: 'Tweet must of be at least 3 characters.' }),
  viewer: z.string().min(3, { message: 'Viewer must of be at least 3 characters.' }),
  // image: z.string().url({ message: 'Image must be a valid URL.' }),
})
