import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  joinedOn: { type: Date, default: Date.now },
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  bookmarked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  communityTweets: [
    {
      communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
      tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    },
  ],
  onboarded: { type: Boolean, default: false },
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
