import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
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
    // hobbies: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model('user', UserSchema);
