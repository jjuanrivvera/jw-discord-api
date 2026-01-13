const GuildService = require('../../../src/services/guild.service');

describe('GuildService', () => {
    let guildService;
    let mockGuildRepository;
    let mockClient;

    beforeEach(() => {
        mockGuildRepository = {
            findByGuildId: jest.fn(),
            upsertByGuildId: jest.fn(),
            getAll: jest.fn(),
            get: jest.fn(),
            getBotGuilds: jest.fn()
        };

        mockClient = {
            guilds: {
                fetch: jest.fn(),
                cache: new Map()
            }
        };

        guildService = new GuildService({
            GuildRepository: mockGuildRepository,
            client: mockClient
        });
    });

    describe('getConfig', () => {
        it('should return guild config when found', async () => {
            const mockConfig = { id: '123', language: 'es' };
            mockGuildRepository.findByGuildId.mockResolvedValue(mockConfig);

            const result = await guildService.getConfig('123');

            expect(mockGuildRepository.findByGuildId).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockConfig);
        });

        it('should return null when guild not found', async () => {
            mockGuildRepository.findByGuildId.mockResolvedValue(null);

            const result = await guildService.getConfig('999');

            expect(result).toBeNull();
        });
    });

    describe('updateConfig', () => {
        it('should update guild configuration', async () => {
            const config = { language: 'en', prefix: '!' };
            const updatedConfig = { id: '123', ...config };
            mockGuildRepository.upsertByGuildId.mockResolvedValue(updatedConfig);

            const result = await guildService.updateConfig('123', config);

            expect(mockGuildRepository.upsertByGuildId).toHaveBeenCalledWith('123', config);
            expect(result).toEqual(updatedConfig);
        });
    });

    describe('userHasAccess', () => {
        it('should return true when user is member of guild', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild' },
                { id: '456', name: 'Other Guild' }
            ]);

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return false when user is not member', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '456', name: 'Other Guild' }
            ]);

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(false);
        });
    });

    describe('userHasAdminAccess', () => {
        it('should return true for guild owner', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: true, permissions: 0 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return true for admin permission (0x8)', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: false, permissions: 0x8 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return false for regular member', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([
                { id: '123', name: 'Test Guild', owner: false, permissions: 0 }
            ]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });

        it('should return false when user not in guild', async () => {
            const user = { id: 'user-1', accessToken: 'token' };
            mockGuildRepository.getAll.mockResolvedValue([]);

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });
    });
});
