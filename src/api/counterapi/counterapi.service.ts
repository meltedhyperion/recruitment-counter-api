import db from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';

interface statesData {
  draft: number;
  pending: number;
  accepted: number;
}

interface RecruitmentInfo {
  totalRegistrations: number;
  tech: statesData;
  editorial: statesData;
  corporate: statesData;
  events: statesData;
}

export const handleGetRecruitmentInfo = async (): Promise<RecruitmentInfo> => {
  try {
    const allApplications = await (
      await db()
    )
      .collection('registrations')
      .find({}, { projection: { _id: 0, application: 1 } })
      .toArray();
    const stats = {
      totalRegistrations: allApplications.length,
      tech: { draft: 0, pending: 0, accepted: 0 },
      editorial: { draft: 0, pending: 0, accepted: 0 },
      corporate: { draft: 0, pending: 0, accepted: 0 },
      events: { draft: 0, pending: 0, accepted: 0 },
    };

    allApplications.forEach(doc => {
      doc.application.forEach(app => {
        if (app.status === 'draft') {
          stats[app.domain]['draft'] += 1;
        } else if (app.status === 'pending') {
          stats[app.domain]['pending'] += 1;
        } else if (app.status === 'accepted') {
          stats[app.domain]['accepted'] += 1;
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
