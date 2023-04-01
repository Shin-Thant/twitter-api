export const checkValuesString = <I extends string, C extends string>(
	itemsPerPage: I,
	currentPage: C
): boolean => {
	return isNaN(Number(itemsPerPage)) || isNaN(Number(currentPage));
};
