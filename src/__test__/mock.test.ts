const add = () => 1 + 2;

describe("mocking", () => {
	const mockAdd = jest.fn();

	it("test", () => {
		mockAdd();

		console.log(mockAdd());
	});
});
