import { Request } from "express";
import { ParsedUrlQuery, ParsedUrlQueryInput } from "querystring";

export interface TypedRequestBody<T> extends Request {
	body: T;
}

export interface TypedRequestQuery<T extends Record<string, string | string[]>>
	extends Request {
	query: T;
}
