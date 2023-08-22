import { Router } from 'express';
import { counterapiRouter } from './counterapi.controller';

export default (): Router => {
  const app = Router();

  app.use('/getInfo', counterapiRouter);

  return app;
};
