const { generateToken } = require("../helpers/jwt.helper");
const axios = require("axios");
const qs = require("qs");
const DiscordOauth2 = require("discord-oauth2");

let _userService = null;
let _config = null;

class AuthService {
  constructor({ UserService, config }) {
    _userService = UserService;
    _config = config;
  }

  async signUp(user) {
    const { username } = user;
    const userExist = await _userService.getUserByUsername(username);
    if (userExist) {
      const error = new Error();
      error.status = 400;
      error.message = "User already exist";
      throw error;
    }

    return await _userService.create(user);
  }

  async signIn(user) {
    const { username, password } = user;
    const userExist = await _userService.getUserByUsername(username);
    if (!userExist) {
      const error = new Error();
      error.status = 404;
      error.message = "User does not exist";
      throw error;
    }

    const validPassword = userExist.comparePasswords(password);
    if (!validPassword) {
      const error = new Error();
      error.status = 400;
      error.message = "Invalid Password";
      throw error;
    }

    const userToEncode = {
      username: userExist.username,
      id: userExist._id,
    };

    const token = generateToken(userToEncode);

    return { token, user: userExist };
  }

  async generateDiscordUrl() {
    const params = {
      client_id: _config.CLIENT_ID,
      redirect_uri: encodeURI(_config.REDIRECT),
      response_type: "code",
      scope: _config.SCOPES,
    };

    let url = _config.OAUTH + "?";

    Object.keys(params).forEach((key) => {
      url += `${key}=${params[key]}&`;
    });

    console.log(url);

    return { url: url };
  }

  async exchangeCode(code) {
    const params = {
      client_id: _config.CLIENT_ID,
      client_secret: _config.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: _config.REDIRECT,
    };

    const url = `${_config.DISCORD_API}/oauth2/token`;
    const data = qs.stringify(params);

    try {
      const response = await axios({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      });

      console.log(response);

      const oauth = new DiscordOauth2();

      const discordUser = await oauth.getUser(response.data.access_token);

      const userExist = await _userService.getUserByUsername(discordUser.id);

      if (userExist) {
        userExist.access_token = response.data.access_token;
        userExist.refresh_token = response.data.refresh_token;
        return userExist.save();
      } else {
        const newUser = await _userService.create({
          id: discordUser.id,
          username: discordUser.username,
          discriminator: discordUser.discriminator,
          avatar: discordUser.avatar,
          email: discordUser.email,
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        });

        return newUser;
      }
    } catch (err) {
      console.log(err);

      const error = new Error();
      error.status = 400;
      error.message = "Invalid Code";
      throw error;
    }
  }
}

module.exports = AuthService;
