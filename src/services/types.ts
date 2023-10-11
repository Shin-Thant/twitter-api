import { QueryOptions, Types, UpdateQuery } from "mongoose";
import { FilterQuery, ProjectionType } from "mongoose";

export interface GetCount<T> {
	filter: FilterQuery<T>;
	options?: QueryOptions<T>;
}

export interface FindOne<T> {
	filter: FilterQuery<T>;
	projection?: ProjectionType<T>;
	options?: QueryOptions<T>;
}

export interface FindMany<T> {
	filter: FilterQuery<T>;
	projection?: ProjectionType<T>;
	options?: QueryOptions<T>;
}

export interface UpdateOne<T> {
	filter: FilterQuery<T>;
	update: UpdateQuery<T>;
	options?: QueryOptions<T>;
}

export interface LikeOne<T> {
	filter: FilterQuery<T>;
	action: "like" | "unlike";
	item: Types.ObjectId;
	options?: QueryOptions<T>;
}

export interface DeleteOne<T> {
	filter: FilterQuery<T>;
	options?: QueryOptions<T>;
}

export interface DeleteMany<T> {
	filter: FilterQuery<T>;
	options?: QueryOptions<T>;
}
