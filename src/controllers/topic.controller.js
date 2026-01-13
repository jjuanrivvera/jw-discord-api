let _topicService = null;

class TopicController {
    constructor({ TopicService }) {
        _topicService = TopicService;
    }

    async list(req, res) {
        try {
            const { page, limit } = req.query;
            const result = await _topicService.list({ page, limit });
            return res.json(result);
        } catch (error) {
            console.error('Error listing topics:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const topic = await _topicService.get(id);

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.json(topic);
        } catch (error) {
            if (error.status === 404) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            console.error('Error getting topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getRandom(req, res) {
        try {
            const topic = await _topicService.getRandom();

            if (!topic) {
                return res.status(404).json({ error: 'No topics available' });
            }

            return res.json(topic);
        } catch (error) {
            console.error('Error getting random topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async search(req, res) {
        try {
            const { q } = req.query;

            if (!q || q.length < 2) {
                return res.status(400).json({ error: 'Search query must be at least 2 characters' });
            }

            const topics = await _topicService.search(q);
            return res.json(topics);
        } catch (error) {
            console.error('Error searching topics:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async create(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { name, discussion, query } = req.body;

            if (!name || !discussion) {
                return res.status(400).json({
                    error: 'name and discussion are required'
                });
            }

            const topic = await _topicService.create({
                name,
                discussion,
                query: query || ''
            });

            return res.status(201).json(topic);
        } catch (error) {
            console.error('Error creating topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async update(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { id } = req.params;
            const { name, discussion, query } = req.body;

            const updateData = {};
            if (name !== undefined) updateData.name = name;
            if (discussion !== undefined) updateData.discussion = discussion;
            if (query !== undefined) updateData.query = query;

            const topic = await _topicService.update(id, updateData);

            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.json(topic);
        } catch (error) {
            console.error('Error updating topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async delete(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }

            const { id } = req.params;
            await _topicService.delete(id);

            return res.status(204).send();
        } catch (error) {
            if (error.status === 404) {
                return res.status(404).json({ error: 'Topic not found' });
            }
            console.error('Error deleting topic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = TopicController;
