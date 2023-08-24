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
    const excludedEmails = [
      'sd1341@srmist.edu.in',
      'ds0431@srmist.edu.in',
      'ad0617@srmist.edu.in',
      'hb9703@srmist.edu.in',
      'ml4851@srmist.edu.in',
      'av3305@srmiat.edu.in',
      'pv8621@srmist.edu.in',
      'na6187@srmist.edu.in',
      'os9186@srmist.edu.in',
      'hr3214@srmist.edu.in',
      'aa0708@srmist.edu.in',
      'tb9022@srmist.edu.in',
      'ab5581@srmist.edu.in',
      'as1545@srmist.edu.in',
      'nj4725@srmist.edu.in',
      'dp9483@srmist.edu.in',
      'ar5842@srmist.edu.in',
      'sa2414@srmist.edu.in',
      'st4262@srmist.edu.in',
      'ps2058@srmist.edu.in',
      'ss2662@srmist.edu.in',
      'by3715@srmist.edu.in',
      'pp6998@srmist.edu.in',
      'Pb2717@srmist.edu.in',
      'mp7447@srmist.edu.in',
      'kumarvaibhavsis@gmail.com',
      'ag8669@srmist.edu.in',
      'as5556@srmist.edu.in',
      'am5656@srmist.edu.in',
      'rv0221@srmist.edu.in',
      'rr4060@srmist.edu.in',
      'pd3771@srmist.edu.in',
      'mp2216@srmist.edu.in',
      'un6427@srmist.edu.in',
      'ag8448@srmist.edu.in',
      'as2915@srmist.edu.in',
      'sa2871@srmist.edu.in',
      'hp8823@srmist.edu.in',
      'nh0050@srmist.edu.in',
      'ms4523@srmist.edu.in',
      'mm5481@srmist.edu.in',
      'ar8930@srmist.edu.in',
      'uv8428@srmist.edu.in',
      'ar6102@srmist.edu.in',
      'jk9691@srmist.edu.in',
      'sk0274@srmist.edu.in',
      'am6328@srmist.edu.in',
      'as0027@srmist.edu.in',
      'dd8353@srmist.edu.in',
      'ag8166@srmist.edu.in',
      'sb2368@srmist.edu.in',
      'jm1985@srmist.edu.in',
      'vr8449@srmist.edu.in',
    ];

    const allApplications = await (
      await db()
    )
      .collection('registrations')
      .find({ email: { $nin: excludedEmails } }, { projection: { _id: 0, application: 1 } })
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
