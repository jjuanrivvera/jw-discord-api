const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    newsNotificationChannelId: {
        type: String,
        default: null
    },
    prefix: {
        type: String,
        default: null
    },
    language: {
        type: String,
        enum: ['es', 'en', 'pt', null],
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('guild', guildSchema);
