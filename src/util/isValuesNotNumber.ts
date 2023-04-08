export const isValuesNotNumber = (...values: unknown[]): boolean => {
	return values.some((val) => isNaN(Number(val)));
};
