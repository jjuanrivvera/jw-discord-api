/**
 * Integration tests for API endpoints
 * Tests the full HTTP request/response cycle
 *
 * Note: MongoDB connection is handled by global setup.js
 */

const request = require('supertest');
const express = require('express');

// Import models
const Text = require('../../src/models/text.model');
const News = require('../../src/models/new.model');
const Topic = require('../../src/models/topic.model');

// Create a minimal express app for testing public routes
const createTestApp = () => {
    const app = express();
    app.use(express.json());

    // Text routes (public)
    app.get('/api/v1/texts', async (req, res) => {
        try {
            const { page = 1, limit = 10, language } = req.query;
            const query = language ? { language } : {};
            const texts = await Text.find(query)
                .sort({ date: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            res.json(texts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/v1/texts/today', async (req, res) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const text = await Text.findOne({ date: today });
            if (!text) {
                return res.status(404).json({ message: 'No text found for today' });
            }
            res.json(text);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/v1/texts/:date', async (req, res) => {
        try {
            const text = await Text.findOne({ date: req.params.date });
            if (!text) {
                return res.status(404).json({ message: 'Text not found' });
            }
            res.json(text);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // News routes (public)
    app.get('/api/v1/news', async (req, res) => {
        try {
            const { page = 1, limit = 10, language } = req.query;
            const query = language ? { language } : {};
            const news = await News.find(query)
                .sort({ isoDate: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            res.json(news);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/v1/news/latest', async (req, res) => {
        try {
            const { language = 'es' } = req.query;
            const latestNews = await News.findOne({ language, last: true });
            if (!latestNews) {
                return res.status(404).json({ message: 'No news found' });
            }
            res.json(latestNews);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Topic routes (public)
    app.get('/api/v1/topics', async (req, res) => {
        try {
            const { page = 1, limit = 20 } = req.query;
            const topics = await Topic.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            res.json(topics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/v1/topics/random', async (req, res) => {
        try {
            const count = await Topic.countDocuments();
            if (count === 0) {
                return res.status(404).json({ message: 'No topics found' });
            }
            const random = Math.floor(Math.random() * count);
            const topic = await Topic.findOne().skip(random);
            res.json(topic);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/api/v1/topics/search', async (req, res) => {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: 'Search query required' });
            }
            const topics = await Topic.find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { discussion: { $regex: q, $options: 'i' } }
                ]
            }).limit(20);
            res.json(topics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return app;
};

describe('API Integration Tests', () => {
    let app;

    beforeAll(() => {
        // MongoDB connection is handled by global setup.js
        app = createTestApp();
    });

    describe('Text Endpoints', () => {
        it('GET /api/v1/texts should return empty array when no texts', async () => {
            const res = await request(app).get('/api/v1/texts');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('GET /api/v1/texts should return texts with pagination', async () => {
            // Seed data
            await Text.create([
                { date: '2024-01-01', text: 'Scripture 1', textContent: 'Content 1', explanation: 'Explanation 1' },
                { date: '2024-01-02', text: 'Scripture 2', textContent: 'Content 2', explanation: 'Explanation 2' }
            ]);

            const res = await request(app).get('/api/v1/texts?page=1&limit=1');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });

        it('GET /api/v1/texts/:date should return text for specific date', async () => {
            await Text.create({
                date: '2024-01-15',
                text: 'Scripture',
                textContent: 'Content',
                explanation: 'Explanation'
            });

            const res = await request(app).get('/api/v1/texts/2024-01-15');
            expect(res.status).toBe(200);
            expect(res.body.date).toBe('2024-01-15');
        });

        it('GET /api/v1/texts/:date should return 404 for non-existent date', async () => {
            const res = await request(app).get('/api/v1/texts/2099-12-31');
            expect(res.status).toBe(404);
        });

        it('GET /api/v1/texts/today should return 404 when no text for today', async () => {
            const res = await request(app).get('/api/v1/texts/today');
            expect(res.status).toBe(404);
        });
    });

    describe('News Endpoints', () => {
        it('GET /api/v1/news should return empty array when no news', async () => {
            const res = await request(app).get('/api/v1/news');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('GET /api/v1/news should return news with language filter', async () => {
            await News.create([
                { title: 'News ES', link: 'http://test.com/1', isoDate: '2024-01-01', language: 'es', last: true },
                { title: 'News EN', link: 'http://test.com/2', isoDate: '2024-01-01', language: 'en', last: true }
            ]);

            const res = await request(app).get('/api/v1/news?language=es');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].language).toBe('es');
        });

        it('GET /api/v1/news/latest should return latest news for language', async () => {
            await News.create({
                title: 'Latest News',
                link: 'http://test.com/latest',
                isoDate: '2024-01-01',
                language: 'es',
                last: true
            });

            const res = await request(app).get('/api/v1/news/latest?language=es');
            expect(res.status).toBe(200);
            expect(res.body.title).toBe('Latest News');
        });

        it('GET /api/v1/news/latest should return 404 when no news', async () => {
            const res = await request(app).get('/api/v1/news/latest?language=en');
            expect(res.status).toBe(404);
        });
    });

    describe('Topic Endpoints', () => {
        it('GET /api/v1/topics should return empty array when no topics', async () => {
            const res = await request(app).get('/api/v1/topics');
            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it('GET /api/v1/topics should return topics with pagination', async () => {
            await Topic.create([
                { name: 'Topic 1', discussion: 'Discussion 1' },
                { name: 'Topic 2', discussion: 'Discussion 2' },
                { name: 'Topic 3', discussion: 'Discussion 3' }
            ]);

            const res = await request(app).get('/api/v1/topics?page=1&limit=2');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });

        it('GET /api/v1/topics/random should return a random topic', async () => {
            await Topic.create([
                { name: 'Topic 1', discussion: 'Discussion 1' },
                { name: 'Topic 2', discussion: 'Discussion 2' }
            ]);

            const res = await request(app).get('/api/v1/topics/random');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name');
        });

        it('GET /api/v1/topics/random should return 404 when no topics', async () => {
            const res = await request(app).get('/api/v1/topics/random');
            expect(res.status).toBe(404);
        });

        it('GET /api/v1/topics/search should find topics by query', async () => {
            await Topic.create([
                { name: 'Faith and Works', discussion: 'Discussion about faith' },
                { name: 'Love Your Neighbor', discussion: 'About love' }
            ]);

            const res = await request(app).get('/api/v1/topics/search?q=faith');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toContain('Faith');
        });

        it('GET /api/v1/topics/search should return 400 without query', async () => {
            const res = await request(app).get('/api/v1/topics/search');
            expect(res.status).toBe(400);
        });
    });
});
