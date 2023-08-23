import { Request, Response } from 'express';
import { handleGetRecruitmentInfo } from './counterapi.service';

export const handleRecruitmentStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await handleGetRecruitmentInfo();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
