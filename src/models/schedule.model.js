const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    guild: {
        type: String,
        required: true,
        index: true
    },
    time: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['sendDailyText', 'sendRandomTopic']
    },
    last: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('schedule', scheduleSchema);
