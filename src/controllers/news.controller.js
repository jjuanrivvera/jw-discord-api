let _newsService = null;

class NewsController {
    constructor({ NewsService }) {
        _newsService = NewsService;
    }

    async list(req, res) {
        try {
            const { page, limit, language } = req.query;

            if (language && !['es', 'en', 'pt'].includes(language)) {
                return res.status(400).json({
                    error: 'Invalid language. Must be one of: es, en, pt'
                });
            }

            const result = await _newsService.list({ page, limit, language });
            return res.json(result);
        } catch (error) {
            console.error('Error listing news:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getLatest(req, res) {
        try {
            const { language } = req.query;
            const validLanguages = ['es', 'en', 'pt'];

            if (language && !validLanguages.includes(language)) {
                return res.status(400).json({
                    error: 'Invalid language. Must be one of: es, en, pt'
                });
            }

            const news = await _newsService.getLatest(language || 'es');

            if (!news) {
                return res.status(404).json({ error: 'No news found' });
            }

            return res.json(news);
        } catch (error) {
            console.error('Error getting latest news:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = NewsController;
