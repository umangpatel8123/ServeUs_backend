import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema({
  phoneNo: {
    type: Number,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  image: {
    type: String,
    required: false,
  },
  visitingFee: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
    min: 0,
    max: 5,
  },
  isServer: {
    type: Boolean,
    default: true,
  },
});
ProviderSchema.index({location: '2dsphere'});

export default mongoose.model('provider', ProviderSchema);
