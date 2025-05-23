'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import User from '../models/user'
import { connectToDB } from '../mongoose'
import { revalidatePath } from 'next/cache'

export async function fetchUser(userId: string) {
  try {
    await connectToDB()
    const userInfo = await User.findOne({ id: userId })
    return userInfo
  } catch (error: any) {
    throw new Error(`Error fetching user info: ${error.message}`)
  }
}

export async function updateUser({
  name,
  bio,
  image,
  username,
}: {
  name: string
  bio: string
  image: string
  username: string
}) {
  const client = await clerkClient()
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([
      connectDbPromise,
      currentUserPromise,
    ])
    if (!currentUserData) throw new Error('No user found')

    const promise1 = User.findOneAndUpdate(
      { id: currentUserData.id },
      {
        name: name,
        bio: bio,
        image: image,
        username: username.toLowerCase(),
        onboarded: true,
      },
      { upsert: true }
    )
    const promise2 = client.users.updateUser(currentUserData.id, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })
    await Promise.all([promise1, promise2])
    revalidatePath('/profile')
  } catch (error: any) {
    throw new Error(`Error updating user info: ${error.message}`)
  }
}

export async function followOrUnfollowUser(userId: string, pathname: string) {
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([
      connectDbPromise,
      currentUserPromise,
    ])
    if (!currentUserData) {
      throw new Error('No user found')
    }
    const userWantToFollowInfo = User.findOne({ id: currentUserData.id })
    const userToFollowInfo = User.findOne({ id: userId })
    const [userWantToFollow, userToFollow] = await Promise.all([
      userWantToFollowInfo,
      userToFollowInfo,
    ])
    if (userWantToFollow.following.includes(userToFollow._id)) {
      userWantToFollow.following = userWantToFollow.following.filter(
        (id: any) => id.toString() !== userToFollow._id.toString()
      )
      userToFollow.followers = userToFollow.followers.filter(
        (id: any) => id.toString() !== userWantToFollow._id.toString()
      )
      const promise1 = userWantToFollow?.save()
      const promise2 = userToFollow?.save()
      await Promise.all([promise1, promise2])
    } else {
      userWantToFollow.following = [
        userToFollow._id,
        ...userWantToFollow.following,
      ]
      userToFollow.followers = [userWantToFollow._id, ...userToFollow.followers]
      const promise1 = userWantToFollow?.save()
      const promise2 = userToFollow?.save()
      await Promise.all([promise1, promise2])
    }
    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error in Following user: ${error.message}`)
  }
}
