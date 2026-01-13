const mongoose = require('mongoose');

const textSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid date format (YYYY-MM-DD)`
        }
    },
    text: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

textSchema.index({ date: 1 });

module.exports = mongoose.model('text', textSchema);
