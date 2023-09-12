import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isServer: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      required: true,
      default: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location',
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('user', UserSchema);
