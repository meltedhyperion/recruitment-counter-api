"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counterapiRouter = void 0;
const counterapi_service_1 = require("./counterapi.service");
const counterapiRouter = async (_req, res, next) => {
    try {
        const data = await (0, counterapi_service_1.handleGetRecruitmentInfo)();
        res.status(200).json({ data });
    }
    catch (err) {
        next(err);
    }
};
exports.counterapiRouter = counterapiRouter;
//# sourceMappingURL=counterapi.controller.js.map