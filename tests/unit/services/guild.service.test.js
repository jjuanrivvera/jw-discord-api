const GuildService = require('../../../src/services/guild.service');

describe('GuildService', () => {
    let guildService;
    let mockGuildRepository;
    let mockClient;
    let mockGuild;
    let mockMembersCache;

    beforeEach(() => {
        mockGuildRepository = {
            findByGuildId: jest.fn(),
            upsertByGuildId: jest.fn(),
            getAll: jest.fn(),
            get: jest.fn(),
            getBotGuilds: jest.fn()
        };

        mockMembersCache = new Map();
        mockGuild = {
            id: '123',
            name: 'Test Guild',
            ownerId: 'owner-id',
            members: {
                cache: mockMembersCache,
                fetch: jest.fn()
            }
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
        it('should return true when user is member of guild (in cache)', async () => {
            const user = { discordId: 'user-1' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Set up the member in cache
            mockMembersCache.set('user-1', { id: 'user-1' });

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return true when user is member of guild (fetched)', async () => {
            const user = { discordId: 'user-1' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Member not in cache, but fetch succeeds
            mockGuild.members.fetch.mockResolvedValue({ id: 'user-1' });

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(true);
            expect(mockGuild.members.fetch).toHaveBeenCalledWith('user-1');
        });

        it('should return false when bot is not in guild', async () => {
            const user = { discordId: 'user-1' };
            // Guild not in cache (bot not in guild)

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(false);
        });

        it('should return false when user is not member', async () => {
            const user = { discordId: 'user-1' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Member not in cache, fetch fails
            mockGuild.members.fetch.mockRejectedValue(new Error('Unknown Member'));

            const result = await guildService.userHasAccess(user, '123');

            expect(result).toBe(false);
        });
    });

    describe('userHasAdminAccess', () => {
        it('should return true for guild owner', async () => {
            const user = { discordId: 'owner-id' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Set up the member in cache
            mockMembersCache.set('owner-id', {
                id: 'owner-id',
                permissions: { has: jest.fn().mockReturnValue(false) }
            });

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return true for admin permission', async () => {
            const user = { discordId: 'admin-user' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Set up the member in cache with admin permission
            mockMembersCache.set('admin-user', {
                id: 'admin-user',
                permissions: { has: jest.fn().mockReturnValue(true) }
            });

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(true);
        });

        it('should return false for regular member', async () => {
            const user = { discordId: 'regular-user' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Set up the member in cache with no admin permission
            mockMembersCache.set('regular-user', {
                id: 'regular-user',
                permissions: { has: jest.fn().mockReturnValue(false) }
            });

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });

        it('should return false when user not in guild', async () => {
            const user = { discordId: 'user-1' };
            // Set up the guild in cache
            mockClient.guilds.cache.set('123', mockGuild);
            // Member not in cache, fetch fails
            mockGuild.members.fetch.mockRejectedValue(new Error('Unknown Member'));

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });

        it('should return false when bot is not in guild', async () => {
            const user = { discordId: 'user-1' };
            // Guild not in cache (bot not in guild)

            const result = await guildService.userHasAdminAccess(user, '123');

            expect(result).toBe(false);
        });
    });
});
