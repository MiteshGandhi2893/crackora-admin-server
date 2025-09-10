const mongoose = require('mongoose');
const examSchema = mongoose.Schema({
    entrance: {
        type: mongoose.Types.ObjectId,
        ref:'Entrance',
        required: [true, 'Please add entrance id']
    },
    title: {
        type: String,
        required: [true, 'Please add exam title']
    },
    description: {type: String},
    isActive: {
        type: Boolean,
        default: true
    },
     content: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema,'Exams');