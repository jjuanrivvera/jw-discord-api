let _guildService = null;
let _config = null;

class GuildController {
  constructor({ GuildService, config }) {
    _guildService = GuildService;
    _config = config;
  }

  async get(req, res) {
    let guilds = await _guildService.getAll(req.user);
    let botGuilds = await _guildService.getBotGuilds();

    guilds = guilds.map(guild => {
      if (guild.icon) {
        guild.icon = `${_config.DISCORD_CDN}/icons/${guild.id}/${guild.icon}.png`;
      }

      const hasBot = botGuilds.find(botGuild => botGuild.id === guild.id);

      guild.hasBot = hasBot ? true : false;

      guild.redirect = hasBot ? "#" : "https://discord.com/api/oauth2/authorize?client_id=778988850512789514&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth&scope=bot%20applications.commands";

      return guild;
    });

    return res.send(guilds);
  }

  async find(req, res) {
    const { guildId } = req.params;

    const guild = await _guildService.get(guildId);

    if (!guild) {
      return res.sendStatus(404);
    }

    return res.send(guild);
  }
}

module.exports = GuildController;
