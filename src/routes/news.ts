import { Router, Request, Response } from 'express';
import db from '../services/db';

const router = Router();

interface NewsQuery {
  state?: string;
  topic?: string;
  search?: string;
}

/**
 * Below endpoint can be used as a simple GET request with optional search params.
 * If no search-query is provided by the client, all `news` entries will be returned.
 *  -> NOTE: this is just for demo. In a real app, the result must be paginated.
 */
router.get('/', (req: Request<{}, {}, {}, NewsQuery>, res: Response) => {
  const { state, topic, search } = req.query;

  // default query
  let sql = 'SELECT * FROM news';
  const conditions = [];
  const params: any[] = [];

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

  dbq.all(params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'An error occurred while retrieving news.' });
    } else {
      res.json(rows);
    }
  });
});

// GET data for specific news
router.get('/:id', (req: Request<{ id: string }, any, any, any>, res: Response): void => {
  const id = parseInt(req.params.id);

  // Check if id is a valid number
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format.' });
  }

  const dbq = db.prepare('SELECT * FROM news WHERE id = ?');

  dbq.get(id, (err: any, row: any) => {
    if (err) {
      // Log the error to a logging service
      console.error('db error - news ::', err);
      dbq.finalize();
      res.status(500).json({ error: 'Server Error' });
    }
    if (!row) {
      dbq.finalize();
      res.status(404).json({ message: 'News article not found.' });
    }
    dbq.finalize();
    res.json(row);
  });
});

router.post('/', (req: any, res: Response) => {
  console.log('news post ::', req);
  res.send('POST request to news');
});

export default router;
