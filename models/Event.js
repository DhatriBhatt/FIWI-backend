const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  image: { type: Schema.Types.ObjectId, ref: 'uploads.files', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    zip: String
  },
  status: { type: String, required: true },
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);