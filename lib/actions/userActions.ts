'use server'

import { currentUser } from '@clerk/nextjs'
import User from '../models/user'
import { connectToDB } from '../mongoose'
import { revalidatePath } from 'next/cache'

export async function fetchUser(userId: string) {
  try {
    connectToDB()
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
  try {
    const database = connectToDB()
    const userData = currentUser()
    const [db, user] = await Promise.all([database, userData])
    if (!user) throw new Error('No user found')

    await User.findOneAndUpdate(
      { id: user.id },
      {
        name: name,
        bio: bio,
        image: image,
        username: username.toLowerCase(),
        onboarded: true,
      },
      { upsert: true }
    )
  } catch (error: any) {
    throw new Error(`Error updating user info: ${error.message}`)
  }
}

export async function followOrUnfollowUser(userId: string, pathname: string) {
  try {
    const database = connectToDB()
    const userData = currentUser()
    const [db, user] = await Promise.all([database, userData])
    if (!user) {
      throw new Error('No user found')
    }
    const userWantToFollowInfo = User.findOne({ id: user.id })
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
      userWantToFollow.following = [userToFollow._id, ...userWantToFollow.following]
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
