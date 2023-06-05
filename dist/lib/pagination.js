"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaginationImpl {
    constructor({ itemsPerPage, currentPage, totalDocs, helper, }) {
        this.totalDocs = totalDocs < 0 ? 0 : totalDocs;
        this.itemsPerPage = helper.validateItemsPerPage(itemsPerPage);
        this.totalPages = helper.calculateTotalPages(this.totalDocs, this.itemsPerPage);
        this.currentPage = helper.validateCurrentPageNumber(currentPage, this.totalPages);
        this.skip = (this.currentPage - 1) * this.itemsPerPage;
    }
    createPaginationResult(result) {
        return {
            totalPages: this.totalPages,
            totalDocs: this.totalDocs,
            hasNextPage: this.currentPage < this.totalPages,
            hasPrevPage: this.currentPage > 1,
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage,
            data: result,
        };
    }
}
exports.default = PaginationImpl;
