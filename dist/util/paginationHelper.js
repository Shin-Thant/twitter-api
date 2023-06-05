"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../config/AppError"));
class PaginationHelperImpl {
    constructor() {
        this._MIN_ITEMS_PER_PAGE = 10;
        this._MAX_ITEMS_PER_PAGE = 30;
        this._FIRST_PAGE_NO = 1;
    }
    validateItemsPerPage(itemsPerPage) {
        if (itemsPerPage <= 0) {
            return this._MIN_ITEMS_PER_PAGE;
        }
        else if (itemsPerPage > this._MAX_ITEMS_PER_PAGE) {
            return this._MAX_ITEMS_PER_PAGE;
        }
        return itemsPerPage;
    }
    validateCurrentPageNumber(currentPage, totalPages) {
        if (currentPage < this._FIRST_PAGE_NO) {
            return this._FIRST_PAGE_NO;
        }
        if (currentPage > totalPages && totalPages !== 0) {
            return totalPages;
        }
        return currentPage;
    }
    calculateTotalPages(totalDocs, itemsPerPage) {
        if (totalDocs < 1) {
            return 0;
        }
        if (itemsPerPage < 1) {
            throw new AppError_1.default("Invalid value!", 500);
        }
        const totalPages = Math.ceil(totalDocs / itemsPerPage);
        return totalPages < 1 ? 1 : totalPages;
    }
}
exports.default = PaginationHelperImpl;
