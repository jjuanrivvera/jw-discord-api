let _textService = null;

class TextController {
    constructor({ TextService }) {
        _textService = TextService;
    }

    async list(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await _textService.list({ page, limit });
            return res.json(result);
        } catch (error) {
            console.error('Error listing texts:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getByDate(req, res) {
        try {
            const { date } = req.params;

            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
            }

            const text = await _textService.getByDate(date);

            if (!text) {
                return res.status(404).json({ error: 'Text not found for this date' });
            }

            return res.json(text);
        } catch (error) {
            console.error('Error getting text:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getToday(req, res) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const text = await _textService.getByDate(today);

            if (!text) {
                return res.status(404).json({ error: 'Text not found for today' });
            }

            return res.json(text);
        } catch (error) {
            console.error('Error getting today text:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async bulkImport(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { texts } = req.body;

            if (!Array.isArray(texts) || texts.length === 0) {
                return res.status(400).json({ error: 'texts must be a non-empty array' });
            }

            for (const text of texts) {
                if (!text.date || !text.text || !text.textContent || !text.explanation) {
                    return res.status(400).json({
                        error: 'Each text must have date, text, textContent, and explanation'
                    });
                }
                if (!/^\d{4}-\d{2}-\d{2}$/.test(text.date)) {
                    return res.status(400).json({
                        error: `Invalid date format for ${text.date}. Use YYYY-MM-DD`
                    });
                }
            }

            const result = await _textService.bulkImport(texts);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error importing texts:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TextController;
