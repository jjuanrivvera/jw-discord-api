let _dashboardService = null;

class DashboardController {
    constructor({ DashboardService }) {
        _dashboardService = DashboardService;
    }

    async getStats(req, res) {
        try {
            const stats = await _dashboardService.getOverallStats();
            return res.json(stats);
        } catch (error) {
            console.error('Error getting stats:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getUserGuilds(req, res) {
        try {
            const guilds = await _dashboardService.getUserGuildsWithStats(req.user);
            return res.json(guilds);
        } catch (error) {
            console.error('Error getting user guilds:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = DashboardController;
