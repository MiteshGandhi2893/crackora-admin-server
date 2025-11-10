const mongoose = require('mongoose');
const coursePackageSchema = new mongoose.Schema({
  entranceID: {
    type: mongoose.Types.ObjectId,
    ref: 'Entrance',
    required: [true, 'Please add entrance id'],
  },
  courseName: {
    type: String
  },
  image: {type: String},
  title: {type: String},
  content: {type: String},
  price: {type: Number},
  features: {type: String},
  discountedPrice: {type: Number},
    teacher: {type: String},
  duration: {type: Number},
  examsCovered: {type: [String]},
  type: {type: String},

}, {
    timestamps: true
});

module.exports = mongoose.model('CoursePackage', coursePackageSchema,'CoursePackages');