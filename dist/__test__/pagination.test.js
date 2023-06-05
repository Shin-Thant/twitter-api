"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = __importDefault(require("../lib/pagination"));
const paginationHelper_1 = __importDefault(require("../util/paginationHelper"));
// TODO: remove `limit` in cliend side type
// TODO: write test when the currentPage or itemsPerPage or totalDocs or some input are minus values
const helper = new paginationHelper_1.default();
const pagination = new pagination_1.default({
    itemsPerPage: 10,
    currentPage: 1,
    totalDocs: 100,
    helper,
});
describe("Pagination when called", () => {
    describe("returned object", () => {
        describe("currentPage property", () => {
            it("should be included", () => {
                expect("currentPage" in pagination).toBe(true);
            });
            it("should be number type", () => {
                expect(typeof pagination.currentPage).toBe("number");
            });
        });
        describe("totalPages property", () => {
            it("should be included", () => {
                expect("totalPages" in pagination).toBe(true);
            });
            it("should be number type", () => {
                expect(typeof pagination.totalPages).toBe("number");
            });
        });
        describe("totalDocs property", () => {
            it("should be included", () => {
                expect("totalDocs" in pagination).toBe(true);
            });
            it("should be number type", () => {
                expect(typeof pagination.totalDocs).toBe("number");
            });
        });
        describe("itemsPerPage property", () => {
            it("should be included", () => {
                expect("itemsPerPage" in pagination).toBe(true);
            });
            it("should be number type", () => {
                expect(typeof pagination.itemsPerPage).toBe("number");
            });
        });
        describe("skip property", () => {
            it("should be included", () => {
                expect("skip" in pagination).toBe(true);
            });
            it("should be number type", () => {
                expect(typeof pagination.skip).toBe("number");
            });
        });
        it("should include createPaginationResult function", () => {
            expect("createPaginationResult" in pagination).toBe(true);
        });
    });
    describe("createPaginationResult function", () => {
        it("should return an object", () => {
            expect(pagination.createPaginationResult([])).toEqual({
                currentPage: 1,
                itemsPerPage: 10,
                totalDocs: 100,
                totalPages: 10,
                hasNextPage: true,
                hasPrevPage: false,
                data: [],
            });
        });
    });
    describe("given valid or invalid inputs value", () => {
        describe("itemsPerPage", () => {
            describe("given minus values", () => {
                it("should return 10", () => {
                    const values = [-1, -5, -11];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: values[i],
                            currentPage: 1,
                            totalDocs: 100,
                            helper,
                        });
                        expect(pagination.itemsPerPage).toBe(10);
                        expect(pagination.totalPages).toBe(10);
                    }
                });
            });
            describe("given valid values", () => {
                it("should return same value", () => {
                    const values = [13, 20, 27];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: values[i],
                            currentPage: 1,
                            totalDocs: 100,
                            helper,
                        });
                        expect(pagination.itemsPerPage).toBe(values[i]);
                    }
                });
            });
            describe("given more than 30", () => {
                it("should return 30", () => {
                    const values = [31, 33, 35];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: 31,
                            currentPage: values[i],
                            totalDocs: 100,
                            helper,
                        });
                        expect(pagination.itemsPerPage).toBe(30);
                    }
                });
            });
        });
        describe("currentPage", () => {
            describe("given minus values", () => {
                it("should return 1", () => {
                    const values = [-1, -5, -11];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: 10,
                            currentPage: values[i],
                            totalDocs: 100,
                            helper,
                        });
                        expect(pagination.currentPage).toBe(1);
                    }
                });
            });
            describe("given more than totalPages", () => {
                it("should return last page number", () => {
                    const pagination = new pagination_1.default({
                        itemsPerPage: 10,
                        currentPage: 11,
                        totalDocs: 100,
                        helper,
                    });
                    expect(pagination.currentPage).toBe(10);
                });
            });
            describe("given valid values", () => {
                it("should return same value", () => {
                    const values = [3, 5, 8];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: 10,
                            currentPage: values[i],
                            totalDocs: 100,
                            helper,
                        });
                        expect(pagination.currentPage).toBe(values[i]);
                    }
                });
            });
        });
        describe("totalDocs", () => {
            describe("given minus values", () => {
                it("should return 0", () => {
                    const values = [-1, -5, -11];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: 10,
                            currentPage: 1,
                            totalDocs: values[i],
                            helper,
                        });
                        expect(pagination.totalDocs).toBe(0);
                    }
                });
            });
            describe("given valid values", () => {
                it("should return same values", () => {
                    const values = [30, 50, 20];
                    for (let i = 0; i < values.length; i++) {
                        const pagination = new pagination_1.default({
                            itemsPerPage: 10,
                            currentPage: 1,
                            totalDocs: values[i],
                            helper,
                        });
                        expect(pagination.totalDocs).toBe(values[i]);
                    }
                });
            });
        });
    });
    describe("given every field invalid values", () => {
        describe("all minus values", () => {
            it("should return valid values", () => {
                const input = {
                    currentPage: -1,
                    itemsPerPage: -1,
                    totalDocs: -1,
                    helper,
                };
                const pagination = new pagination_1.default(input);
                expect(pagination.currentPage).toBe(1);
                expect(pagination.itemsPerPage).toBe(10);
                expect(pagination.totalDocs).toBe(0);
                expect(pagination.totalPages).toBe(0);
                expect(pagination.skip).toBe(0);
                expect(pagination.createPaginationResult([])).toEqual({
                    totalPages: 0,
                    totalDocs: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                    currentPage: 1,
                    itemsPerPage: 10,
                    data: [],
                });
            });
        });
        describe("given exceed currentPage and itemsPerPage (13, 50)", () => {
            it("should return valid values", () => {
                const input = {
                    currentPage: 13,
                    itemsPerPage: 50,
                    totalDocs: 100,
                    helper,
                };
                const pagination = new pagination_1.default(input);
                expect(pagination.currentPage).toBe(4);
                expect(pagination.itemsPerPage).toBe(30);
                expect(pagination.totalDocs).toBe(100);
                expect(pagination.totalPages).toBe(4);
                expect(pagination.skip).toBe(90);
                expect(pagination.createPaginationResult([])).toEqual({
                    totalPages: 4,
                    totalDocs: 100,
                    hasNextPage: false,
                    hasPrevPage: true,
                    currentPage: 4,
                    itemsPerPage: 30,
                    data: [],
                });
            });
        });
        describe("given minus itemsPerPage (3)", () => {
            it("should return valid values", () => {
                const input = {
                    currentPage: 1,
                    itemsPerPage: 10,
                    totalDocs: 100,
                    helper,
                };
                const pagination = new pagination_1.default(input);
                expect(pagination.currentPage).toBe(1);
                expect(pagination.itemsPerPage).toBe(10);
                expect(pagination.totalDocs).toBe(100);
                expect(pagination.totalPages).toBe(10);
                expect(pagination.skip).toBe(0);
                expect(pagination.createPaginationResult([])).toEqual({
                    totalPages: 10,
                    totalDocs: 100,
                    hasNextPage: true,
                    hasPrevPage: false,
                    currentPage: 1,
                    itemsPerPage: 10,
                    data: [],
                });
            });
        });
        describe("given valid values", () => {
            it("should return valid values", () => {
                const input = {
                    currentPage: 3,
                    itemsPerPage: 20,
                    totalDocs: 100,
                    helper,
                };
                const pagination = new pagination_1.default(input);
                expect(pagination.currentPage).toBe(3);
                expect(pagination.itemsPerPage).toBe(20);
                expect(pagination.totalDocs).toBe(100);
                expect(pagination.totalPages).toBe(5);
                expect(pagination.skip).toBe(40);
                expect(pagination.createPaginationResult([])).toEqual({
                    totalPages: 5,
                    totalDocs: 100,
                    hasNextPage: true,
                    hasPrevPage: true,
                    currentPage: 3,
                    itemsPerPage: 20,
                    data: [],
                });
            });
        });
    });
});
// TODO: wirte test for totalPages is 0 and currentPage is 1