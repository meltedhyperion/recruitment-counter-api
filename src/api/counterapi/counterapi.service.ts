import db from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';

interface Application {
  domain: string;
  status: string;
  appliedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

interface Applications {
  application: Application[];
}

interface StatesData {
  draft: number;
  pending: number;
  accepted: number;
}

interface RecruitmentInfo {
  totalRegistrations: number;
  totalDraftApplication: number;
  totalPendingApplication: number;
  totalAcceptedApplication: number;
  technical: StatesData;
  corporate: StatesData;
  events: StatesData;
  content_writing: StatesData;
  vfx: StatesData;
  gfx: StatesData;
  photography: StatesData;
}

export const handleGetRecruitmentInfo = async (): Promise<RecruitmentInfo> => {
  try {
    const allApplications = await (
      await db()
    )
      .collection('registrations')
      .find({}, { projection: { _id: 0, application: 1 } })
      .toArray();

    const stats: RecruitmentInfo = {
      totalRegistrations: allApplications.length,
      totalDraftApplication: 0,
      totalPendingApplication: 0,
      totalAcceptedApplication: 0,
      technical: { draft: 0, pending: 0, accepted: 0 },
      gfx: { draft: 0, pending: 0, accepted: 0 },
      vfx: { draft: 0, pending: 0, accepted: 0 },
      content_writing: { draft: 0, pending: 0, accepted: 0 },
      photography: { draft: 0, pending: 0, accepted: 0 },
      corporate: { draft: 0, pending: 0, accepted: 0 },
      events: { draft: 0, pending: 0, accepted: 0 },
    };

    allApplications.forEach((doc: Applications) => {
      doc.application.forEach((app: Application) => {
        const { domain, status } = app;

        if (status && domain && domain in stats && status in stats[domain]) {
          stats[domain][status] += 1;
          if (status === 'draft') {
            stats.totalDraftApplication += 1;
          } else if (status === 'pending') {
            stats.totalPendingApplication += 1;
          } else if (status === 'accepted') {
            stats.totalAcceptedApplication += 1;
          }
        }
      });
    });

    return stats;
  } catch (err) {
    LoggerInstance.error('Error while getting recruitment info: ', err);
    throw err;
  }
};
