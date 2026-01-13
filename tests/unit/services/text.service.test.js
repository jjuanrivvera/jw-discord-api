const TextService = require('../../../src/services/text.service');

describe('TextService', () => {
    let textService;
    let mockRepository;
    let mockModel;

    beforeEach(() => {
        mockRepository = {
            findByDate: jest.fn(),
            findByDateRange: jest.fn()
        };

        mockModel = {
            find: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
            countDocuments: jest.fn().mockResolvedValue(0),
            bulkWrite: jest.fn()
        };

        textService = new TextService({
            TextRepository: mockRepository,
            Text: mockModel
        });
    });

    describe('getByDate', () => {
        it('should return text for specific date', async () => {
            const mockText = {
                date: '2024-01-01',
                text: 'Proverbios 3:5',
                textContent: 'Trust in Jehovah',
                explanation: 'This verse...'
            };
            mockRepository.findByDate.mockResolvedValue(mockText);

            const result = await textService.getByDate('2024-01-01');

            expect(mockRepository.findByDate).toHaveBeenCalledWith('2024-01-01');
            expect(result).toEqual(mockText);
        });

        it('should return null when text not found', async () => {
            mockRepository.findByDate.mockResolvedValue(null);

            const result = await textService.getByDate('2099-01-01');

            expect(result).toBeNull();
        });
    });

    describe('getByDateRange', () => {
        it('should return texts for date range', async () => {
            const mockTexts = [
                { date: '2024-01-01', text: 'Verse 1' },
                { date: '2024-01-02', text: 'Verse 2' }
            ];
            mockRepository.findByDateRange.mockResolvedValue(mockTexts);

            const result = await textService.getByDateRange('2024-01-01', '2024-01-02');

            expect(mockRepository.findByDateRange).toHaveBeenCalledWith('2024-01-01', '2024-01-02');
            expect(result).toEqual(mockTexts);
        });
    });

    describe('bulkImport', () => {
        it('should import multiple texts', async () => {
            const texts = [
                { date: '2024-01-01', text: 'Verse 1', textContent: 'Content 1', explanation: 'Exp 1' },
                { date: '2024-01-02', text: 'Verse 2', textContent: 'Content 2', explanation: 'Exp 2' }
            ];

            mockModel.bulkWrite.mockResolvedValue({
                upsertedCount: 2,
                modifiedCount: 0
            });

            const result = await textService.bulkImport(texts);

            expect(mockModel.bulkWrite).toHaveBeenCalled();
            expect(result).toEqual({
                imported: 2,
                updated: 0,
                total: 2
            });
        });
    });
});
