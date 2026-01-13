class DashboardService {
    constructor({ Guild, Schedule, Text, New, Topic, GuildService }) {
        this.Guild = Guild;
        this.Schedule = Schedule;
        this.Text = Text;
        this.New = New;
        this.Topic = Topic;
        this.guildService = GuildService;
    }

    async getOverallStats() {
        const [
            totalGuilds,
            totalSchedules,
            totalTexts,
            totalNews,
            totalTopics
        ] = await Promise.all([
            this.Guild.countDocuments(),
            this.Schedule.countDocuments(),
            this.Text.countDocuments(),
            this.New.countDocuments(),
            this.Topic.countDocuments()
        ]);

        return {
            guilds: totalGuilds,
            schedules: totalSchedules,
            dailyTexts: totalTexts,
            newsArticles: totalNews,
            topics: totalTopics
        };
    }

    async getUserGuildsWithStats(user) {
        const userGuilds = await this.guildService.getAll(user);
        const botGuilds = await this.guildService.getBotGuilds();
        const botGuildsArray = Array.from(botGuilds.values());

        const guildsWithStats = await Promise.all(
            userGuilds
                .filter(g => botGuildsArray.some(bg => bg.id === g.id))
                .map(async (guild) => {
                    const config = await this.Guild.findOne({ id: guild.id });
                    const scheduleCount = await this.Schedule.countDocuments({ guild: guild.id });

                    return {
                        id: guild.id,
                        name: guild.name,
                        icon: guild.icon,
                        language: config?.language || 'default',
                        schedules: scheduleCount,
                        hasNewsChannel: !!config?.newsNotificationChannelId
                    };
                })
        );

        return guildsWithStats;
    }
}

module.exports = DashboardService;
