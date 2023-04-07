export const checkValuesString = (...values: unknown[]): boolean => {
	return values.some((val) => isNaN(Number(val)));
};
