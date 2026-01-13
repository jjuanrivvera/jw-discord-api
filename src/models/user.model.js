const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        default: '0'
    },
    avatar: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.virtual('tag').get(function() {
    if (this.discriminator === '0') {
        return this.username;
    }
    return `${this.username}#${this.discriminator}`;
});

userSchema.methods.updateTokens = function(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.lastLogin = new Date();
    return this.save();
};

userSchema.statics.findOrCreateFromDiscord = async function(discordUser, tokens = {}) {
    let user = await this.findOne({ discordId: discordUser.id });

    if (user) {
        user.username = discordUser.username;
        user.discriminator = discordUser.discriminator || '0';
        user.avatar = discordUser.avatar;
        if (tokens.accessToken) user.accessToken = tokens.accessToken;
        if (tokens.refreshToken) user.refreshToken = tokens.refreshToken;
        user.lastLogin = new Date();
        await user.save();
    } else {
        user = await this.create({
            discordId: discordUser.id,
            username: discordUser.username,
            discriminator: discordUser.discriminator || '0',
            avatar: discordUser.avatar,
            email: discordUser.email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }

    return user;
};

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.accessToken;
    delete user.refreshToken;
    return user;
};

module.exports = mongoose.model('user', userSchema);
