const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discussion: {
        type: String,
        required: true
    },
    query: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

topicSchema.index({ name: 'text', discussion: 'text' });

module.exports = mongoose.model('topic', topicSchema);
