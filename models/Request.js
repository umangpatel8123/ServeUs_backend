import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provider',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

export default mongoose.model('request', RequestSchema);
