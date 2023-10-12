import * as z from 'zod'

export const userValidation = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  image: z.string().url({ message: 'Image must be a valid URL.' }).nonempty(),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' }),
  bio: z.string().min(3, { message: 'Bio must be at least 3 characters.' }),
})
