"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValuesNotNumber = void 0;
const isValuesNotNumber = (...values) => {
    return values.some((val) => isNaN(Number(val)));
};
exports.isValuesNotNumber = isValuesNotNumber;
