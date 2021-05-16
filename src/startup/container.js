const { createContainer, asClass, asValue, asFunction } = require("awilix");

// discord client
const Discord = require("discord.js");
const client = new Discord.Client();

//  config
const config = require("../config");
const app = require(".");

client.login(process.env.DISCORD_TOKEN);

// services
const { AuthService, GuildService, UserService } = require("../services");

// controllers
const { AuthController, GuildController, UserController } = require("../controllers");

// routes
const { AuthRoutes, GuildRoutes, UserRoutes } = require("../routes/index.routes");
const Routes = require("../routes");

// models
const { User, Comment, Idea } = require("../models");

// repositories
const { UserRepository, GuildRepository } = require("../repositories");

const container = createContainer();

container
  .register({
    app: asClass(app).singleton(),
    router: asFunction(Routes).singleton(),
    config: asValue(config),
    client: asValue(client)
  })
  .register({
    AuthService: asClass(AuthService).singleton(),
    GuildService: asClass(GuildService).singleton(),
    UserService: asClass(UserService).singleton(),
  })
  .register({
    AuthController: asClass(AuthController.bind(AuthController)).singleton(),
    GuildController: asClass(GuildController.bind(GuildController)).singleton(),
    UserController: asClass(UserController.bind(UserController)).singleton(),
  })
  .register({
    AuthRoutes: asFunction(AuthRoutes).singleton(),
    GuildRoutes: asFunction(GuildRoutes).singleton(),
    UserRoutes: asFunction(UserRoutes).singleton(),
  })
  .register({
    User: asValue(User),
  })
  .register({
    UserRepository: asClass(UserRepository).singleton(),
    GuildRepository: asClass(GuildRepository).singleton(),
  });

module.exports = container;
