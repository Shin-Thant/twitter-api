import AppError from "../config/AppError";

export interface PaginationHelper {
	validateItemsPerPage(itemsPerPage: number): number;
	validateCurrentPage(currentPage: number, totalPages: number): number;
	calculateTotalPages(totalDocs: number, itemsPerPage: number): number;
}

export default class PaginationHelperImpl implements PaginationHelper {
	private readonly MIN_ITEMS_PER_PAGE = 10;
	private readonly MAX_ITEMS_PER_PAGE = 30;
	private readonly FIRST_PAGE_NO = 1;

	public validateItemsPerPage(itemsPerPage: number): number {
		if (itemsPerPage <= 0) {
			return this.MIN_ITEMS_PER_PAGE;
		} else if (itemsPerPage > this.MAX_ITEMS_PER_PAGE) {
			return this.MAX_ITEMS_PER_PAGE;
		}
		return itemsPerPage;
	}

	public validateCurrentPage(
		currentPage: number,
		totalPages: number
	): number {
		if (currentPage < this.FIRST_PAGE_NO) {
			return this.FIRST_PAGE_NO;
		}
		if (currentPage > totalPages && totalPages !== 0) {
			return totalPages;
		}
		return currentPage;
	}

	public calculateTotalPages(
		totalDocs: number,
		itemsPerPage: number
	): number {
		if (totalDocs < 1) {
			return 0;
		}
		if (itemsPerPage < 1) {
			throw new AppError("Invalid value!", 500);
		}
		const totalPages = Math.ceil(totalDocs / itemsPerPage);
		return totalPages < 1 ? 1 : totalPages;
	}
}
