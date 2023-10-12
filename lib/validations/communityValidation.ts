import * as z from 'zod'

export const communityValidation = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters.' })
    .max(30, { message: 'Name must be less than 30 characters.' }),
  purpose: z.string().min(3, { message: 'Purpose must be at least 3 characters.' }),
  rules: z.string().min(10, { message: 'Rules must be at least 10 characters.' }),
  image: z.string().url({ message: 'Image must be a valid URL.' }).nonempty(),
})
