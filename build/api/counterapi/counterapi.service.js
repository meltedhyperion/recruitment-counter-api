"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRecruitmentInfo = void 0;
const database_1 = __importDefault(require("../../loaders/database"));
const logger_1 = __importDefault(require("../../loaders/logger"));
const handleGetRecruitmentInfo = async () => {
    try {
        const excludedEmails = JSON.parse(process.env.EXCLUDED_MAILS);
        const allApplications = await (await (0, database_1.default)())
            .collection('users')
            .find({ email: { $nin: excludedEmails } }, { projection: { _id: 0, application: 1 } })
            .toArray();
        const stats = {
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
        allApplications.forEach((doc) => {
            doc.application.forEach((app) => {
                const { domain, status } = app;
                if (status && domain && domain in stats && status in stats[domain]) {
                    stats[domain][status] += 1;
                    if (status === 'draft') {
                        stats.totalDraftApplication += 1;
                    }
                    else if (status === 'pending') {
                        stats.totalPendingApplication += 1;
                    }
                    else if (status === 'accepted') {
                        stats.totalAcceptedApplication += 1;
                    }
                }
            });
        });
        return stats;
    }
    catch (err) {
        logger_1.default.error('Error while getting recruitment info: ', err);
        throw err;
    }
};
exports.handleGetRecruitmentInfo = handleGetRecruitmentInfo;
//# sourceMappingURL=counterapi.service.js.map