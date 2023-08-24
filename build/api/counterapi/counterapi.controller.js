"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRecruitmentStats = void 0;
const counterapi_service_1 = require("./counterapi.service");
const handleRecruitmentStats = async (req, res) => {
    try {
        const data = await (0, counterapi_service_1.handleGetRecruitmentInfo)();
        res.status(200).json({ data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.handleRecruitmentStats = handleRecruitmentStats;
//# sourceMappingURL=counterapi.controller.js.map