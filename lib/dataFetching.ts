import { currentUser } from '@clerk/nextjs/server'
import Tweet from './models/tweet'
import { connectToDB } from './mongoose'
import User from './models/user'
import Community from './models/community'

export async function fetchTweetByTweetId(tweetId: string) {
  try {
    await connectToDB()
    const tweet = await Tweet.findById(tweetId)
      .populate('author')
      .populate({
        path: 'quotedTweetId',
        populate: {
          path: 'author',
          select: 'image name username',
        },
      })
    return tweet
  } catch (error: any) {
    throw new Error(`Error fetching tweet: ${error.message}`)
  }
}

export async function fetchTweets() {
  try {
    await connectToDB()
    const tweets = await Tweet.find({ parentId: null, community: null })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'author',
        select: 'name username image id following followers bio',
      })
      .populate({
        path: 'quotedTweetId',
        populate: {
          path: 'author',
          select: 'image name username',
        },
      })
    return tweets
  } catch (error: any) {
    throw new Error(`Error fetching tweets: ${error.message}`)
  }
}
export async function fetchCommunityTweetsForCurrentUser() {
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([
      connectDbPromise,
      currentUserPromise,
    ])
    if (!currentUserData) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentUserData.id }).populate({
      path: 'communities',
      select: 'posts',
      populate: {
        path: 'posts',
        populate: [
          {
            path: 'author',
            select: 'name username image id following followers bio',
          },
          {
            path: 'quotedTweetId',
            populate: {
              path: 'author',
              select: 'image name username',
            },
          },
          {
            path: 'community',
            select: 'name',
          },
        ],
      },
    })
    const tweets = userInfo.communities
      .map((community: any) => community.posts)
      .flat()
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
    return tweets
  } catch (error: any) {
    throw new Error(`Error fetching tweets: ${error.message}`)
  }
}

export async function fetchTweetsOfFollowingUsers() {
  try {
    const connectDbPromise = connectToDB()
    const currentUserPromise = currentUser()
    const [db, currentUserData] = await Promise.all([
      connectDbPromise,
      currentUserPromise,
    ])
    if (!currentUserData) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentUserData.id }).select(
      'following'
    )
    const tweets = await Tweet.find({
      parentId: null,
      author: { $in: userInfo.following },
    })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'author',
        select: 'name username image id following followers bio',
      })
      .populate({
        path: 'quotedTweetId',
        populate: {
          path: 'author',
          select: 'image name username',
        },
      })
    return tweets
  } catch (error: any) {
    throw new Error(`Error fetching tweets: ${error.message}`)
  }
}

export async function fetchTweetsByUserId(userId: string) {
  try {
    await connectToDB()
    const user = await User.findOne({ id: userId }).populate({
      path: 'tweets',
      populate: [
        {
          path: 'author',
          select: 'name username image id following followers bio',
        },
        {
          path: 'quotedTweetId',
          populate: {
            path: 'author',
            select: 'image name username',
          },
        },
      ],
    })
    return user.tweets
  } catch (error: any) {
    throw new Error(`Error fetching tweets: ${error.message}`)
  }
}

export async function fetchLikedTweetsByUserId(userId: string) {
  try {
    await connectToDB()
    const user = await User.findOne({ id: userId }).populate({
      path: 'liked',
      populate: [
        {
          path: 'author',
          select: 'name username image id following followers bio',
        },
        {
          path: 'quotedTweetId',
          populate: {
            path: 'author',
            select: 'image name username',
          },
        },
      ],
    })
    return user.liked
  } catch (error: any) {
    throw new Error(`Error fetching tweets: ${error.message}`)
  }
}
