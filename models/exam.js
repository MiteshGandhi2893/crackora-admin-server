const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
  title: { type: String, required: true },
  id: { type: String, required: true },   // slug/id for anchors
  link: { type: String, required: true }, // optional: "#id" for frontend scrolling
});

const examSchema = mongoose.Schema({
  entrance: {
    type: mongoose.Types.ObjectId,
    ref: 'Entrance',
    required: [true, 'Please add entrance id'],
  },
  title: {
    type: String,
    required: [true, 'Please add exam title'],
  },
  slug: String,
  description: { type: String },
  isActive: {
    type: Boolean,
    default: true,
  },
  content: { type: String },
  sections: {
    type: [sectionSchema],
    default: [],
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema, 'Exams');
