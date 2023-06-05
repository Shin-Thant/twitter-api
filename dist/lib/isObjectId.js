"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function isObjectId(id) {
    return (0, mongoose_1.isValidObjectId)(id);
}
exports.default = isObjectId;
