import mongoose from 'mongoose'

const tweetSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quotedTweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null },
  quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  repostedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },
})

const Tweet = mongoose.models.Tweet || mongoose.model('Tweet', tweetSchema)

export default Tweet
