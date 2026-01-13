const { createContainer, asClass, asValue, asFunction } = require('awilix');

// Discord.js v14
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Config
const config = require('../config');
const app = require('.');

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

// Services
const {
    AuthService,
    GuildService,
    UserService,
    ScheduleService,
    TextService,
    NewsService,
    TopicService,
    DashboardService
} = require('../services');

// Controllers
const {
    AuthController,
    GuildController,
    UserController,
    ScheduleController,
    TextController,
    NewsController,
    TopicController,
    DashboardController
} = require('../controllers');

// Routes
const {
    AuthRoutes,
    GuildRoutes,
    UserRoutes,
    ScheduleRoutes,
    TextRoutes,
    NewsRoutes,
    TopicRoutes,
    DashboardRoutes
} = require('../routes/index.routes');
const Routes = require('../routes');

// Models
const { User, Guild, Schedule, Text, New, Topic } = require('../models');

// Repositories
const {
    UserRepository,
    GuildRepository,
    ScheduleRepository,
    TextRepository,
    NewsRepository,
    TopicRepository
} = require('../repositories');

const container = createContainer();

container
    // Core
    .register({
        app: asClass(app).singleton(),
        router: asFunction(Routes).singleton(),
        config: asValue(config),
        client: asValue(client)
    })
    // Models
    .register({
        User: asValue(User),
        Guild: asValue(Guild),
        Schedule: asValue(Schedule),
        Text: asValue(Text),
        New: asValue(New),
        Topic: asValue(Topic)
    })
    // Repositories
    .register({
        UserRepository: asClass(UserRepository).singleton(),
        GuildRepository: asClass(GuildRepository).singleton(),
        ScheduleRepository: asClass(ScheduleRepository).singleton(),
        TextRepository: asClass(TextRepository).singleton(),
        NewsRepository: asClass(NewsRepository).singleton(),
        TopicRepository: asClass(TopicRepository).singleton()
    })
    // Services
    .register({
        AuthService: asClass(AuthService).singleton(),
        GuildService: asClass(GuildService).singleton(),
        UserService: asClass(UserService).singleton(),
        ScheduleService: asClass(ScheduleService).singleton(),
        TextService: asClass(TextService).singleton(),
        NewsService: asClass(NewsService).singleton(),
        TopicService: asClass(TopicService).singleton(),
        DashboardService: asClass(DashboardService).singleton()
    })
    // Controllers
    .register({
        AuthController: asClass(AuthController.bind(AuthController)).singleton(),
        GuildController: asClass(GuildController.bind(GuildController)).singleton(),
        UserController: asClass(UserController.bind(UserController)).singleton(),
        ScheduleController: asClass(ScheduleController.bind(ScheduleController)).singleton(),
        TextController: asClass(TextController.bind(TextController)).singleton(),
        NewsController: asClass(NewsController.bind(NewsController)).singleton(),
        TopicController: asClass(TopicController.bind(TopicController)).singleton(),
        DashboardController: asClass(DashboardController.bind(DashboardController)).singleton()
    })
    // Routes
    .register({
        AuthRoutes: asFunction(AuthRoutes).singleton(),
        GuildRoutes: asFunction(GuildRoutes).singleton(),
        UserRoutes: asFunction(UserRoutes).singleton(),
        ScheduleRoutes: asFunction(ScheduleRoutes).singleton(),
        TextRoutes: asFunction(TextRoutes).singleton(),
        NewsRoutes: asFunction(NewsRoutes).singleton(),
        TopicRoutes: asFunction(TopicRoutes).singleton(),
        DashboardRoutes: asFunction(DashboardRoutes).singleton()
    });

module.exports = container;
