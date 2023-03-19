import { NextFunction, Request, Response } from "express";

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	res.status(500).json({ status: "fail", message: "msg" });
};

export default errorHandler;
