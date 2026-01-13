let _scheduleService = null;
let _guildService = null;

class ScheduleController {
    constructor({ ScheduleService, GuildService }) {
        _scheduleService = ScheduleService;
        _guildService = GuildService;
    }

    async getByGuild(req, res) {
        const { guildId } = req.params;

        const hasAccess = await _guildService.userHasAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const schedules = await _scheduleService.getByGuild(guildId);
        return res.json(schedules);
    }

    async create(req, res) {
        const { guildId } = req.params;
        const { time, channelId, action } = req.body;

        const hasAccess = await _guildService.userHasAdminAccess(req.user, guildId);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        if (!['sendDailyText', 'sendRandomTopic'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action. Must be sendDailyText or sendRandomTopic' });
        }

        const hour = parseInt(time);
        if (isNaN(hour) || hour < 0 || hour > 23) {
            return res.status(400).json({ error: 'Invalid time. Must be 0-23' });
        }

        if (!channelId) {
            return res.status(400).json({ error: 'channelId is required' });
        }

        const schedule = await _scheduleService.create({
            guild: guildId,
            time: time.toString().padStart(2, '0'),
            channelId,
            action,
            last: ''
        });

        return res.status(201).json(schedule);
    }

    async update(req, res) {
        const { scheduleId } = req.params;
        const { time, channelId, action } = req.body;

        const schedule = await _scheduleService.get(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const hasAccess = await _guildService.userHasAdminAccess(req.user, schedule.guild);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        if (action && !['sendDailyText', 'sendRandomTopic'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action. Must be sendDailyText or sendRandomTopic' });
        }

        if (time !== undefined) {
            const hour = parseInt(time);
            if (isNaN(hour) || hour < 0 || hour > 23) {
                return res.status(400).json({ error: 'Invalid time. Must be 0-23' });
            }
        }

        const updateData = {};
        if (time !== undefined) updateData.time = time.toString().padStart(2, '0');
        if (channelId !== undefined) updateData.channelId = channelId;
        if (action !== undefined) updateData.action = action;

        const updated = await _scheduleService.update(scheduleId, updateData);

        return res.json(updated);
    }

    async delete(req, res) {
        const { scheduleId } = req.params;

        const schedule = await _scheduleService.get(scheduleId);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const hasAccess = await _guildService.userHasAdminAccess(req.user, schedule.guild);
        if (!hasAccess) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        await _scheduleService.delete(scheduleId);

        return res.status(204).send();
    }
}

module.exports = ScheduleController;
