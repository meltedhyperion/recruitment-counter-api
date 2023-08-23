import { Router } from 'express';
import { handleRecruitmentStats } from './counterapi/counterapi.controller';

export default (): Router => {
  const app = Router();

  app.get('/recruitments/stats', handleRecruitmentStats);

  return app;
};
