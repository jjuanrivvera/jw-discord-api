const NewsService = require('../../../src/services/news.service');

describe('NewsService', () => {
    let newsService;
    let mockRepository;
    let mockModel;

    beforeEach(() => {
        mockRepository = {
            findLatestByLanguage: jest.fn(),
            findByLanguage: jest.fn()
        };

        mockModel = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
            countDocuments: jest.fn().mockResolvedValue(0)
        };

        newsService = new NewsService({
            NewsRepository: mockRepository,
            New: mockModel
        });
    });

    describe('getLatest', () => {
        it('should return latest news for language', async () => {
            const mockNews = {
                title: 'Latest News',
                link: 'https://example.com/news',
                language: 'es',
                last: true
            };
            mockRepository.findLatestByLanguage.mockResolvedValue(mockNews);

            const result = await newsService.getLatest('es');

            expect(mockRepository.findLatestByLanguage).toHaveBeenCalledWith('es');
            expect(result).toEqual(mockNews);
        });

        it('should default to Spanish', async () => {
            mockRepository.findLatestByLanguage.mockResolvedValue(null);

            await newsService.getLatest();

            expect(mockRepository.findLatestByLanguage).toHaveBeenCalledWith('es');
        });
    });

    describe('getByLanguage', () => {
        it('should return news for specific language', async () => {
            const mockNews = [
                { title: 'News 1', language: 'en' },
                { title: 'News 2', language: 'en' }
            ];
            mockRepository.findByLanguage.mockResolvedValue(mockNews);

            const result = await newsService.getByLanguage('en', 10);

            expect(mockRepository.findByLanguage).toHaveBeenCalledWith('en', 10);
            expect(result).toEqual(mockNews);
        });
    });
});
