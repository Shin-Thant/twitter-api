import { Request, Response } from "express";

type ParamsType = { id?: string };
export const getUserById = (req: Request<ParamsType>, res: Response) => {
	const { id } = req.params;
	if (!id) {
		return;
	}
};
