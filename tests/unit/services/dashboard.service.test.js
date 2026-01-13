const DashboardService = require('../../../src/services/dashboard.service');

describe('DashboardService', () => {
    let dashboardService;
    let mockModels;
    let mockGuildService;

    beforeEach(() => {
        mockModels = {
            Guild: { countDocuments: jest.fn().mockResolvedValue(10), findOne: jest.fn() },
            Schedule: { countDocuments: jest.fn().mockResolvedValue(25) },
            Text: { countDocuments: jest.fn().mockResolvedValue(365) },
            New: { countDocuments: jest.fn().mockResolvedValue(50) },
            Topic: { countDocuments: jest.fn().mockResolvedValue(30) }
        };

        mockGuildService = {
            getAll: jest.fn(),
            getBotGuilds: jest.fn()
        };

        dashboardService = new DashboardService({
            Guild: mockModels.Guild,
            Schedule: mockModels.Schedule,
            Text: mockModels.Text,
            New: mockModels.New,
            Topic: mockModels.Topic,
            GuildService: mockGuildService
        });
    });

    describe('getOverallStats', () => {
        it('should return all statistics', async () => {
            const result = await dashboardService.getOverallStats();

            expect(result).toEqual({
                guilds: 10,
                schedules: 25,
                dailyTexts: 365,
                newsArticles: 50,
                topics: 30
            });
        });

        it('should call all count methods', async () => {
            await dashboardService.getOverallStats();

            expect(mockModels.Guild.countDocuments).toHaveBeenCalled();
            expect(mockModels.Schedule.countDocuments).toHaveBeenCalled();
            expect(mockModels.Text.countDocuments).toHaveBeenCalled();
            expect(mockModels.New.countDocuments).toHaveBeenCalled();
            expect(mockModels.Topic.countDocuments).toHaveBeenCalled();
        });
    });

    describe('getUserGuildsWithStats', () => {
        it('should return guilds with stats for user', async () => {
            const mockUser = { id: 'user-1', accessToken: 'token' };
            const mockUserGuilds = [
                { id: '123', name: 'Guild 1', icon: 'icon1' },
                { id: '456', name: 'Guild 2', icon: 'icon2' }
            ];
            const mockBotGuilds = new Map([
                ['123', { id: '123', name: 'Guild 1' }]
            ]);

            mockGuildService.getAll.mockResolvedValue(mockUserGuilds);
            mockGuildService.getBotGuilds.mockResolvedValue(mockBotGuilds);
            mockModels.Guild.findOne.mockResolvedValue({ language: 'es', newsNotificationChannelId: 'ch-1' });
            mockModels.Schedule.countDocuments.mockResolvedValue(3);

            const result = await dashboardService.getUserGuildsWithStats(mockUser);

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: '123',
                name: 'Guild 1',
                language: 'es',
                schedules: 3,
                hasNewsChannel: true
            });
        });

        it('should return empty array when user has no guilds with bot', async () => {
            const mockUser = { id: 'user-1', accessToken: 'token' };
            mockGuildService.getAll.mockResolvedValue([{ id: '999', name: 'No Bot Guild' }]);
            mockGuildService.getBotGuilds.mockResolvedValue(new Map());

            const result = await dashboardService.getUserGuildsWithStats(mockUser);

            expect(result).toHaveLength(0);
        });
    });
});
