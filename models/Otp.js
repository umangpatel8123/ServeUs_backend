import mongoose from 'mongoose';

const OtpSchema = mongoose.Schema(
  {
    phoneNo: {
      type: String,
      require: true,
      unique: true,
    },
    otp: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      index: {expires: 300},
    },
  },
  {
    versionKey: false,
  }
);
export default mongoose.model('otp', OtpSchema);
