import { Router } from 'express';
import counterapiRouter from './counterapi/counterapi.router';

export default (): Router => {
  const app = Router();

  app.use('/recruitments', counterapiRouter());

  return app;
};
