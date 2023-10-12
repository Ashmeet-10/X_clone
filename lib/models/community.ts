import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String, required: true },
  rules: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profileImage: { type: String },
})

const Community = mongoose.models.Community || mongoose.model('Community', communitySchema)

export default Community
