const BaseService = require("./base.service");
let _userRepository = null;

class UserService extends BaseService {
  constructor({ UserRepository }) {
    super(UserRepository);
    _userRepository = UserRepository;
  }

  async getUserByUsername(username) {
    return await _userRepository.getUserByUsername(username);
  }

  async getUserByDiscordId(id) {
    return await _userRepository.getUserByDiscordId(id);
  }
}

module.exports = UserService;
