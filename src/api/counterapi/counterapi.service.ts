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

        if (domain in stats) {
          if (status === 'draft') {
            stats[domain]['draft'] += 1;
          } else if (status === 'pending') {
            stats[domain]['pending'] += 1;
          } else if (status === 'accepted') {
            stats[domain]['accepted'] += 1;
          }
        }
      });
    });

    return stats;

    // -----------------

    // const stats = await (await db()).collection('registrations').aggregate([
    //   {
    //     $unwind: '$application',
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         domain: '$application.domain',
    //         status: '$application.status',
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$_id.domain',
    //       counts: {
    //         $push: {
    //           status: '$_id.status',
    //           count: '$count',
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       domain: '$_id',
    //       counts: 1,
    //     },
    //   },
    // ]);

    // const statsCursor = await stats.toArray();
    // console.log(statsCursor);

    // const totalRegistrations = statsCursor.reduce((acc, domainStats) => {
    //   return acc + domainStats.counts.reduce((statusAcc, count) => count.count, 0);
    // }, 0);

    // const formattedStats = {
    //   total_registrations: totalRegistrations,
    // };
    // const domainFinalstats = {};

    // stats.forEach(domainStat => {
    //   console.log('domainstat', domainStat);
    //   const statusCounts = domainStat.counts.reduce((acc, count) => {
    //     acc[count.status] = count.count;
    //     console.log('acc', acc);
    //     return acc;
    //   }, {});
    //   domainFinalstats[domainStat.domain] = {
    //     draft: statusCounts.draft || 0,
    //     pending: statusCounts.pending || 0,
    //     accepted: statusCounts.accepted || 0,
    //   };
    // });
    // console.log(domainFinalstats);
    // return formattedStats;
  } catch (err) {
    LoggerInstance.error('Error while getting recruitment info: %o', err);
    throw err;
  }
};
