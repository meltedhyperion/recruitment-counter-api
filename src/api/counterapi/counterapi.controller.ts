import { NextFunction, Request, Response } from 'express';
import { handleGetRecruitmentInfo } from './counterapi.service';

export const counterapiRouter = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await handleGetRecruitmentInfo();
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
