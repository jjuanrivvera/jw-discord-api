const { AuthService } = require("../services");

let _authService = null;

class AuthController {
  constructor({ AuthService, config }) {
    _authService = AuthService;
  }

  async signUp(req, res) {
    const { body } = req;
    const createdUser = await _authService.signUp(body);
    return res.status(201).send(createdUser);
  }

  async signIn(req, res) {
    const { body } = req;
    const creds = await _authService.signIn(body);
    return res.send(creds);
  }

  async discord(req, res) {
    const url = await _authService.generateDiscordUrl();

    return res.send(url);
  }

  async exchangeCode(req, res) {
    const { body } = req;
    const code = body.code;
    const data = await _authService.exchangeCode(code);

    return res.send(data);
  }
}

module.exports = AuthController;
