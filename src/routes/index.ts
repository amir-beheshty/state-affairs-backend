import { Router, Request, Response } from 'express';
import newsRoutes from './news';

const router: Router = Router();

/* GET home page. */
router.get('/', (req: Request, res: Response): void => {
  res.render('index', { title: 'Express' });
});

// news routes
router.use('/news', newsRoutes);

export default router;
