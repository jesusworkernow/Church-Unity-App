// routes/youtube.js
// YouTube Data API integration
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/youtube-latest?church=NAME
router.get('/youtube-latest', async (req, res) => {
  const { church } = req.query;
  if (!church) {
    return res.status(400).json({ error: 'Missing church query parameter' });
  }
  try {
    const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: church,
        type: 'channel',
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 1,
      },
    });
    if (!searchRes.data.items || searchRes.data.items.length === 0) {
      return res.status(404).json({ error: 'No matching YouTube channel found' });
    }
    const channelId = searchRes.data.items[0].snippet.channelId || searchRes.data.items[0].id.channelId;
    const videosRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId,
        order: 'date',
        maxResults: 1,
        type: 'video',
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    if (!videosRes.data.items || videosRes.data.items.length === 0) {
      return res.status(404).json({ error: 'No videos found for this channel' });
    }
    const video = videosRes.data.items[0];
    res.json({
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'YouTube API error' });
  }
});

// GET /api/search-church-youtube?churchName=NAME
router.get('/search-church-youtube', async (req, res) => {
  const { churchName } = req.query;
  if (!churchName) {
    return res.status(400).json({ error: 'Missing churchName query parameter' });
  }
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: churchName,
          type: 'video',
          order: 'date',
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 1
        }
      }
    );
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'No videos found' });
    }
    const video = response.data.items[0];
    res.json({
      title: video.snippet.title,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
    });
  } catch (err) {
    console.error('YouTube search failed:', err.response?.data || err.message);
    res.status(500).json({ error: 'YouTube search failed' });
  }
});

// GET /api/youtube?name=CHURCH_NAME
// Example: curl "http://localhost:5000/api/youtube?name=First%20Church"
router.get('/', async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Missing name query parameter' });
  }
  if (!process.env.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY not set in env' });
  }
  try {
    const result = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: name,
        type: 'video',
        order: 'date',
        key: process.env.YOUTUBE_API_KEY,
        maxResults: 1
      }
    });
    if (!result.data.items || result.data.items.length === 0) {
      return res.status(404).json({ error: 'No video found' });
    }
    const video = result.data.items[0];
    res.json({
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`
    });
  } catch (err) {
    console.error('YouTube API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'YouTube API error' });
  }
});

module.exports = router;
