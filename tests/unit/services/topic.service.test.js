const TopicService = require('../../../src/services/topic.service');

describe('TopicService', () => {
    let topicService;
    let mockRepository;
    let mockModel;

    beforeEach(() => {
        mockRepository = {
            findRandom: jest.fn(),
            search: jest.fn(),
            get: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockModel = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
            countDocuments: jest.fn().mockResolvedValue(0)
        };

        topicService = new TopicService({
            TopicRepository: mockRepository,
            Topic: mockModel
        });
    });

    describe('getRandom', () => {
        it('should return a random topic', async () => {
            const mockTopic = {
                name: 'Faith',
                discussion: 'What is faith?',
                query: 'faith'
            };
            mockRepository.findRandom.mockResolvedValue(mockTopic);

            const result = await topicService.getRandom();

            expect(mockRepository.findRandom).toHaveBeenCalled();
            expect(result).toEqual(mockTopic);
        });

        it('should return null when no topics exist', async () => {
            mockRepository.findRandom.mockResolvedValue(null);

            const result = await topicService.getRandom();

            expect(result).toBeNull();
        });
    });

    describe('search', () => {
        it('should search topics by query', async () => {
            const mockTopics = [
                { name: 'Faith', discussion: 'About faith' },
                { name: 'Faithful', discussion: 'Being faithful' }
            ];
            mockRepository.search.mockResolvedValue(mockTopics);

            const result = await topicService.search('faith');

            expect(mockRepository.search).toHaveBeenCalledWith('faith');
            expect(result).toEqual(mockTopics);
        });

        it('should return empty array when no matches', async () => {
            mockRepository.search.mockResolvedValue([]);

            const result = await topicService.search('nonexistent');

            expect(result).toEqual([]);
        });
    });
});
