const ScheduleService = require('../../../src/services/schedule.service');

describe('ScheduleService', () => {
    let scheduleService;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            findByGuild: jest.fn(),
            findByGuildAndAction: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn()
        };

        scheduleService = new ScheduleService({
            ScheduleRepository: mockRepository
        });
    });

    describe('getByGuild', () => {
        it('should return all schedules for a guild', async () => {
            const mockSchedules = [
                { guild: '123', action: 'sendDailyText', time: '07' },
                { guild: '123', action: 'sendRandomTopic', time: '19' }
            ];
            mockRepository.findByGuild.mockResolvedValue(mockSchedules);

            const result = await scheduleService.getByGuild('123');

            expect(mockRepository.findByGuild).toHaveBeenCalledWith('123');
            expect(result).toEqual(mockSchedules);
        });

        it('should return empty array when no schedules', async () => {
            mockRepository.findByGuild.mockResolvedValue([]);

            const result = await scheduleService.getByGuild('999');

            expect(result).toEqual([]);
        });
    });

    describe('findByGuildAndAction', () => {
        it('should return schedules for specific action', async () => {
            const mockSchedules = [
                { guild: '123', action: 'sendDailyText', time: '07' }
            ];
            mockRepository.findByGuildAndAction.mockResolvedValue(mockSchedules);

            const result = await scheduleService.findByGuildAndAction('123', 'sendDailyText');

            expect(mockRepository.findByGuildAndAction).toHaveBeenCalledWith('123', 'sendDailyText');
            expect(result).toEqual(mockSchedules);
        });
    });

    describe('create', () => {
        it('should create a new schedule', async () => {
            const scheduleData = {
                guild: '123',
                time: '08',
                channelId: 'channel-1',
                action: 'sendDailyText'
            };
            const createdSchedule = { _id: 'schedule-1', ...scheduleData };
            mockRepository.create.mockResolvedValue(createdSchedule);

            const result = await scheduleService.create(scheduleData);

            expect(mockRepository.create).toHaveBeenCalledWith(scheduleData);
            expect(result).toEqual(createdSchedule);
        });
    });
});
