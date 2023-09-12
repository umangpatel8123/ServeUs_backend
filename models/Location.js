import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: false,
  },
  latitude: {
    type: Number,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
});

export default mongoose.model('location', LocationSchema);
