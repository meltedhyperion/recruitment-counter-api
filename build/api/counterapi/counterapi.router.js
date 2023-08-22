"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const counterapi_controller_1 = require("./counterapi.controller");
exports.default = () => {
    const app = (0, express_1.Router)();
    app.use('/counterapi', counterapi_controller_1.counterapiRouter);
    return app;
};
//# sourceMappingURL=counterapi.router.js.map