import { Router, Request, Response } from 'express';
import newsRoutes from './news';

const router: Router = Router();

router.get('/', (_req: Request, res: Response): void => {
  res.render('index', { title: 'Express' });
});

router.use('/news', newsRoutes);

export default router;
