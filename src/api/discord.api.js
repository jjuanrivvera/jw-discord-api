const BaseApi = require('./base.api');
const config = require('../config');

class DiscordApi extends BaseApi {
    constructor(user) {
        super(config.DISCORD_API, {
            Authorization: `Bearer ${user.access_token}`
        });
    }

    async getGuilds () {
        return await this.get('/users/@me/guilds');
    }
}

module.exports = DiscordApi;