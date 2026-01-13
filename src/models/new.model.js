const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    pubDate: {
        type: Date
    },
    language: {
        type: String,
        enum: ['es', 'en', 'pt'],
        default: 'es',
        index: true
    },
    last: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('new', newSchema);
