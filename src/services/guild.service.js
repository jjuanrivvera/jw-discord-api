let _guilRepository = null;

class GuildService {
  constructor({ GuildRepository }) {
    _guilRepository = GuildRepository;
  }

  async get(guildId) {
    return await _guilRepository.get(guildId);
  }

  async getAll(user) {
    return await _guilRepository.getAll(user);
  }

  async getBotGuilds() {
    return await _guilRepository.getBotGuilds();
  }
}

module.exports = GuildService;
