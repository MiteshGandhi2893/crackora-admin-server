const mongoose = require('mongoose');
const entranceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add entrance title']
    },
    description: {type: String},
    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Entrance', entranceSchema,'Entrances');