const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    // The user who receives the notification.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Type can be "job" (and you can add other types later)
    type: {
      type: String,
      enum: ['job'],
      required: true,
    },
    // A message describing the notification.
    message: {
      type: String,
      required: true,
    },
    // Optional: reference to a Job document if applicable.
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
