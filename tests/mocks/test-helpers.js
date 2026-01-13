const jwt = require('jsonwebtoken');

const JWT_SECRET = 'test-secret-key';

/**
 * Generate a valid JWT token for testing
 */
function generateTestToken(user = {}) {
    const payload = {
        id: user.id || 'test-user-123',
        discordId: user.discordId || '123456789',
        username: user.username || 'testuser',
        role: user.role || 'user',
        accessToken: user.accessToken || 'test-access-token'
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
    });
}

/**
 * Generate an admin token
 */
function generateAdminToken() {
    return generateTestToken({ role: 'admin' });
}

/**
 * Create a mock Express request
 */
function mockRequest(overrides = {}) {
    return {
        params: {},
        query: {},
        body: {},
        user: null,
        headers: {},
        ...overrides
    };
}

/**
 * Create a mock Express response
 */
function mockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    return res;
}

/**
 * Create a mock user object
 */
function createMockUser(overrides = {}) {
    return {
        id: 'test-user-id',
        discordId: '123456789',
        username: 'testuser',
        discriminator: '0',
        avatar: 'avatar-hash',
        email: 'test@example.com',
        role: 'user',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        ...overrides
    };
}

/**
 * Create a mock guild object
 */
function createMockGuild(overrides = {}) {
    return {
        id: '987654321',
        name: 'Test Guild',
        language: 'es',
        newsNotificationChannelId: 'channel-123',
        prefix: 'jw!',
        ...overrides
    };
}

/**
 * Create a mock schedule object
 */
function createMockSchedule(overrides = {}) {
    return {
        guild: '987654321',
        time: '07',
        channelId: 'channel-456',
        action: 'sendDailyText',
        last: '',
        ...overrides
    };
}

module.exports = {
    generateTestToken,
    generateAdminToken,
    mockRequest,
    mockResponse,
    createMockUser,
    createMockGuild,
    createMockSchedule,
    JWT_SECRET
};
