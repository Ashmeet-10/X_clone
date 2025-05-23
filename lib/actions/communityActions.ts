'use server'

import { currentUser } from '@clerk/nextjs/server'
import { connectToDB } from '../mongoose'
import User from '../models/user'
import Community from '../models/community'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCommunity({
  name,
  purpose,
  rules,
  image,
}: {
  name: string
  purpose: string
  rules: string
  image: string
}) {
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
    if (!currentUserData) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentUserData.id })
    const community = await Community.create({
      name: name,
      purpose: purpose,
      rules: rules,
      profileImage: image,
      createdBy: userInfo._id,
      members: [userInfo._id],
    })
    userInfo.communities = [community._id, ...userInfo.communities]
    await userInfo.save()
    revalidatePath('/communities')
    redirect(`/communities/${community._id}}`)
    console.log(community)
  } catch (error: any) {
    throw new Error(`Error creating community: ${error.message}`)
  }
}

export async function joinOrLeaveCommunity(
  communityId: string,
  pathname: string
) {
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([connectDbPromise, currentUserPromise])
    if (!currentUserData) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentUserData.id })
    const communityInfo = Community.findById(communityId)
    const [user, community] = await Promise.all([userInfo, communityInfo])
    //leave community
    if (user.communities.includes(community._id)) {
      user.communities = user.communities.filter(
        (singleCommunity: any) => singleCommunity.toString() !== communityId
      )
      community.members = community.members.filter(
        (member: any) => member.toString() !== user._id.toString()
      )
    }
    // join community
    else {
      user.communities = [community._id, ...user.communities]
      community.members = [...community.members, user._id]
    }
    const promise1 = user.save()
    const promise2 = community.save()
    await Promise.all([promise1, promise2])
    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error joining community: ${error.message}`)
  }
}