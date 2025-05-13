'use server'

import { revalidatePath } from 'next/cache'
import Tweet from '../models/tweet'
import { connectToDB } from '../mongoose'
import User from '../models/user'
import { currentUser } from '@clerk/nextjs'
import Community from '../models/community'

export async function createTweet({ text }: { text: string }) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentuser.id })
    const tweet = await Tweet.create({
      text: text,
      author: userInfo._id,
    })
    userInfo.tweets = [tweet._id, ...userInfo.tweets]
    await userInfo.save()
    revalidatePath('/')
  } catch (error: any) {
    throw new Error(`Error creating tweet: ${error.message}`)
  }
}

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
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentuser.id }).populate({
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
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentuser.id }).select(
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

export async function createReply({
  text,
  tweetId,
}: {
  text: string
  tweetId: string
}) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = await User.findOne({ id: currentuser.id })
    const tweetInfo = Tweet.findById(tweetId)
    const replyInfo = Tweet.create({
      text: text,
      author: userInfo?._id,
      parentId: tweetId,
    })
    const [tweet, reply] = await Promise.all([tweetInfo, replyInfo])
    tweet.replies = [reply._id, ...tweet.replies]
    await tweet.save()
    revalidatePath(`/tweet/${tweetId}`)
  } catch (error: any) {
    throw new Error(`Error creating reply: ${error.message}`)
  }
}

export async function likeTweet(tweetId: string, pathname: string) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const tweetInfo = Tweet.findById(tweetId)
    const [user, tweet] = await Promise.all([userInfo, tweetInfo])
    if (!user.liked.includes(tweetId)) user.liked = [tweetId, ...user.liked]
    else user.liked = user.liked.filter((id: any) => id.toString() !== tweetId)
    if (!tweet.likes.includes(user._id))
      tweet.likes = [user._id, ...tweet.likes]
    else
      tweet.likes = tweet.likes.filter(
        (id: any) => id.toString() !== user._id.toString()
      )
    const promise1 = tweet.save()
    const promise2 = user.save()
    await Promise.all([promise1, promise2])
    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error liking/Unliking tweet: ${error.message}`)
  }
}

export async function repostTweet(tweetId: string, pathname: string) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const tweetInfo = Tweet.findById(tweetId)
    const [user, tweet] = await Promise.all([userInfo, tweetInfo])
    if (tweet.repostedBy.includes(user._id)) {
      tweet.repostedBy = tweet.repostedBy.filter(
        (id: any) => id.toString() !== user._id.toString()
      )
      user.tweets = user.tweets.filter((id: any) => id.toString() !== tweetId)
    } else {
      tweet.repostedBy = [user._id, ...tweet.repostedBy]
      user.tweets = [tweetId, ...user.tweets]
    }
    await tweet.save()
    await user.save()
    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error reposting tweet: ${error.message}`)
  }
}

export async function quoteTweet({
  text,
  quotedTweetId,
}: {
  text: string
  quotedTweetId: string
}) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const quotedTweetInfo = Tweet.findById(quotedTweetId)
    const [user, quotedTweet] = await Promise.all([userInfo, quotedTweetInfo])
    const tweet = await Tweet.create({
      text: text,
      author: user._id,
      quotedTweetId: quotedTweetId,
    })
    user.tweets = [tweet._id, ...user.tweets]
    quotedTweet.quotes = [tweet._id, ...quotedTweet.quotes]

    const userSave = user.save()
    const quotedTweetSave = quotedTweet.save()
    await Promise.all([userSave, quotedTweetSave])
    revalidatePath('/')
    console.log(tweet)
  } catch (error: any) {
    throw new Error(`Error quoting tweet: ${error.message}`)
  }
}

export async function quoteTweetInCommunity({
  text,
  quotedTweetId,
  communityId,
}: {
  text: string
  quotedTweetId: string
  communityId: string
}) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const quotedTweetInfo = Tweet.findById(quotedTweetId)
    const communityInfo = Community.findById(communityId)
    const [user, quotedTweet, community] = await Promise.all([
      userInfo,
      quotedTweetInfo,
      communityInfo,
    ])
    const tweet = await Tweet.create({
      text: text,
      author: user._id,
      quotedTweetId: quotedTweetId,
      community: community._id,
    })
    // Find the index of the community with the specified communityId in user.communityTweets
    const communityIndex = user.communityTweets.findIndex(
      (ct: any) => ct.communityId.toString() === community._id.toString()
    )
    if (communityIndex !== -1) {
      // If the community already exists, update its tweets array
      user.communityTweets[communityIndex].tweets = [
        tweet._id,
        user.communityTweets[communityIndex].tweets,
      ]
    } else {
      // If the community doesn't exist, create a new object
      user.communityTweets = [
        {
          communityId: community._id,
          tweets: [tweet._id],
        },
        ...user.communityTweets,
      ]
    }
    quotedTweet.quotes = [tweet._id, ...quotedTweet.quotes]
    community.posts = [tweet._id, ...community.posts]
    const quotedTweetSave = quotedTweet.save()
    const userSave = user.save()
    const communitySave = community.save()
    await Promise.all([quotedTweetSave, userSave, communitySave])
    revalidatePath('/communities')
  } catch (error) {
    console.error(error)
  }
}

export async function bookmarkOrUnbookmarkTweet(
  tweetId: string,
  pathname: string
) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const tweetInfo = Tweet.findById(tweetId)
    const [user, tweet] = await Promise.all([userInfo, tweetInfo])
    if (user.bookmarked.includes(tweetId)) {
      user.bookmarked = user.bookmarked.filter(
        (id: any) => id.toString() !== tweetId
      )
      tweet.bookmarkedBy = tweet.bookmarkedBy.filter(
        (id: any) => id.toString() !== user._id.toString()
      )
    } else {
      user.bookmarked = [tweetId, ...user.bookmarked]
      tweet.bookmarkedBy = [user._id, ...tweet.bookmarkedBy]
    }
    const promise1 = user.save()
    const promise2 = tweet.save()
    await Promise.all([promise1, promise2])
    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error bookmarking tweet: ${error.message}`)
  }
}

export async function createCommunityTweet({
  text,
  communityName,
}: {
  text: string
  communityName: string
}) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id })
    const communityInfo = Community.findOne({ name: communityName })
    const [user, community] = await Promise.all([userInfo, communityInfo])
    const tweet = await Tweet.create({
      text: text,
      author: user._id,
      community: community._id,
    })
    // Find the index of the community with the specified communityId in user.communityTweets
    const communityIndex = user.communityTweets.findIndex(
      (ct: any) => ct.communityId.toString() === community._id.toString()
    )

    if (communityIndex !== -1) {
      // If the community already exists, update its tweets array
      user.communityTweets[communityIndex].tweets = [
        tweet._id,
        ...user.communityTweets[communityIndex].tweets,
      ]
    } else {
      // If the community doesn't exist, create a new object
      user.communityTweets = [
        {
          communityId: community._id,
          tweets: [tweet._id],
        },
        ...user.communityTweets,
      ]
    }
    community.posts = [tweet._id, ...community.posts]
    const userSave = user.save()
    const communitySave = community.save()
    await Promise.all([userSave, communitySave])
    revalidatePath('/communities')
  } catch (error: any) {
    throw new Error(`Error creating community tweet: ${error.message}`)
  }
}

export async function deleteTweet(tweetId: string, pathname: string) {
  try {
    const database = connectToDB()
    const currentUserInfo = currentUser()
    const [db, currentuser] = await Promise.all([database, currentUserInfo])
    if (!currentuser) throw new Error('No user found')
    const userInfo = User.findOne({ id: currentuser.id }).select('tweets')
    const tweetInfo = Tweet.findById(tweetId)
      .populate({ path: 'likes', select: 'liked' })
      .populate({ path: 'repostedBy', select: 'reposted' })
      .populate({ path: 'bookmarkedBy', select: 'bookmarked' })
      .populate({ path: 'author', select: 'communityTweets' })
      .populate({ path: 'quotes', select: 'quotedTweetId' })
      .populate({ path: 'quotedTweetId', select: 'quotes' })
      .populate({ path: 'community', select: 'posts' })
    const [user, tweet] = await Promise.all([userInfo, tweetInfo])
    console.log(tweet)
    if (tweet.parentId) {
      const parentTweet = await Tweet.findById(tweet.parentId)
      if (parentTweet) {
        parentTweet.replies = parentTweet?.replies?.filter(
          (id: any) => id.toString() !== tweetId
        )
        await parentTweet.save()
      }
    }
    const promise1 = tweet.bookmarkedBy?.map((user: any) => {
      user.bookmarked = user.bookmarked?.filter(
        (id: any) => id.toString() !== tweetId
      )
      user.save()
    })
    const promise2 = tweet.likes?.map((user: any) => {
      user.liked = user.liked?.filter((id: any) => id.toString() !== tweetId)
      user.save()
    })
    const promise3 = tweet.repostedBy?.map((user: any) => {
      user.reposted = user.reposted?.filter(
        (id: any) => id.toString() !== tweetId
      )
      user.save()
    })

    const promise4 = tweet.quotes?.map((quote: any) => {
      quote.quotedTweetId = null
      quote.save()
    })
    if (tweet.community) {
      tweet.community.posts = tweet.community.posts?.filter(
        (id: any) => id.toString() !== tweetId
      )
    }
    if (tweet.quotedTweetId) {
      tweet.quotedTweetId.quotes = tweet.quotedTweetId?.quotes?.filter(
        (id: any) => id.toString() !== tweetId
      )
    }

    tweet.author.communityTweets?.map((ct: any) => {
      ct.tweets = ct.tweets?.filter((id: any) => id.toString() !== tweetId)
    })
    user.tweets = user.tweets?.filter((id: any) => id.toString() !== tweetId)
    const promise5 = tweet.author.save()
    const promise6 = tweet?.community?.save()
    const promise7 = tweet.quotedTweetId?.save()
    const promise8 = user.save()
    const promise9 = Tweet.deleteOne({ _id: tweetId })
    await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
      promise5,
      promise6,
      promise7,
      promise8,
      promise9,
    ])

    revalidatePath(pathname)
  } catch (error: any) {
    throw new Error(`Error deleting tweet: ${error.message}`)
  }
}
