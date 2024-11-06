import { Router, Request, Response } from 'express';
import db from '../services/db';
import { News, NewsQuery, NewsRow } from 'interfaces';
import { getCachedData, setCacheData } from '../services/cache';

const router = Router();

/*
 * Below endpoint can be used as a simple GET request with optional search params.
 * If no search-query is provided by the client, all `news` entries will be returned.
 *  -> NOTE: this is just for demo. In a real app, the result must be paginated.
 */
router.get('/', (req: Request<{}, {}, {}, NewsQuery>, res: Response) => {
  const { state, topic, search } = req.query;

  // Check cache first
  const cachedData = getCachedData(req.query);
  if (cachedData) {
    res.json(cachedData);
    return;
  }

  // default query
  let sql = 'SELECT * FROM news';
  const conditions = [];
  const params: string[] = [];

  /**
   * search queries to fileter data
   */
  if (state) {
    conditions.push('LOWER(state) = LOWER(?)');
    params.push(state);
  }

  if (topic) {
    conditions.push('LOWER(topic) = LOWER(?)');
    params.push(topic);
  }

  if (search) {
    conditions.push('(LOWER(title) LIKE ? OR LOWER(summary) LIKE LOWER(?))');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  // prepare database-query
  const dbq = db.prepare(sql);

  dbq.all(params, (err, rows: NewsRow[]) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while retrieving news.' });
    } else {
      // Update cache
      setCacheData(req.query, rows);
      res.json(rows);
    }
  });
});

// GET data for specific news
router.get('/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id = parseInt(req.params.id);

  // Check if id is a valid number
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID.' });
  }

  const dbq = db.prepare('SELECT * FROM news WHERE id = ?');

  dbq.get(id, (err: Error | null, row?: NewsRow) => {
    if (err) {
      dbq.finalize();
      return res.status(500).json({ error: 'Server Error' });
    }
    if (!row) {
      dbq.finalize();
      return res.status(404).json({ message: 'News article not found.' });
    }
    dbq.finalize();
    return res.json(row);
  });
});

/**
 * Sample request:
 curl -X POST http://localhost:3000/api/v1/news \
   -H "Content-Type: application/json" \
   -d '{
     "title": "Sample News Article",
     "summary": "This is a sample news article summary",
     "state": "published",
     "topic": "technology",
     "source_url": "https://example.com/article",
     "published_at": "2024-03-14T12:00:00Z"
   }'
 */
router.post('/', (req: Request<{}, {}, News>, res: Response) => {
  const { title, summary, state, topic, source_url, published_at } = req.body;

  const requiredData = ['title', 'summary', 'state', 'topic', 'source_url', 'published_at'];

  // Assumption: All data is required by default
  const missingData = [];
  for (const key of requiredData) {
    if (!Object.hasOwn(req.body, key)) {
      missingData.push(key);
    }
  }

  if (missingData.length) {
    res.status(400).json({
      error: `Missing required fields: (${missingData.join(', ')}) ${
        missingData.length > 1 ? 'are' : 'is'
      } required.`,
    });
  } else {
    db.run(
      `INSERT INTO news (title, summary, state, topic, url, published_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, summary, state, topic, source_url, published_at],
      function (err) {
        if (err) {
          res.status(500).json({ error: 'Failed to create news entry' });
        } else {
          res.status(201).json({ id: this.lastID });
        }
      },
    );
  }
});

export default router;
