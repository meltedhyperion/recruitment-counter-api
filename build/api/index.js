"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const counterapi_controller_1 = require("./counterapi/counterapi.controller");
exports.default = () => {
    const app = (0, express_1.Router)();
    app.get('/recruitments/stats', counterapi_controller_1.handleRecruitmentStats);
    return app;
};
//# sourceMappingURL=index.js.map