import supertest from "supertest";
import app from "../app/app";
import { NextFunction, Request, Response } from "express";
import { connectDB, disconnectDB } from "../config/database";
import User from "../models/User";
import { LeanUser } from "../models/types/userTypes";

jest.mock("../lib/rateLimit", () => (_arg1: number, _arg2: number) => {
	return (_req: Request, _res: Response, next: NextFunction) => {
		return next();
	};
});

describe("/auth", () => {
	beforeAll(async () => {
		await connectDB();
	});
	afterAll(async () => {
		await disconnectDB();
	});

	describe("/login", () => {
		describe("given invalid request body", () => {
			it("should return status 400 and a message", async () => {
				const requestBodyArr = [
					{},
					{ email: "hello@gmail.com" },
					{ password: "hello@gmail.com" },
				];
				const responseBody = {
					message: "All fields are required!",
					status: "fail",
				};

				for (const reqBody of requestBodyArr) {
					const { body } = await supertest(app)
						.post("/api/v1/auth/login")
						.send(reqBody)
						.expect(400);
					expect(body).toEqual(responseBody);
				}
			});
		});

		describe("given invalid email", () => {
			it("should return status 400 and a 'Invalid email or password!' message", async () => {
				const reqBody = {
					email: "invalid@mail.com",
					password: "randomstr",
				};

				const responseBody = {
					message: "Invalid email or password!",
					status: "fail",
				};

				const { body } = await supertest(app)
					.post("/api/v1/auth/login")
					.send(reqBody)
					.expect(400);

				expect(body).toEqual(responseBody);
			});
		});

		describe("given invalid password", () => {
			it("should return status 400 and a 'Invalid email or password!' message", async () => {
				const reqBody = {
					email: "Ada_Schultz36@test.com",
					password: "randomstr",
				};
				const responseBody = {
					message: "Invalid email or password!",
					status: "fail",
				};

				const { body } = await supertest(app)
					.post("/api/v1/auth/login")
					.send(reqBody)
					.expect(400);

				expect(body).toEqual(responseBody);
			});
		});

		describe("given valid email and password", () => {
			let user: LeanUser;
			beforeAll(async () => {
				const foundUser = await User.findOne()
					.populate("followers")
					.lean()
					.exec();
				user = foundUser!;
			});
			it("should return user and access token", async () => {
				const reqBody = {
					email: user.email,
					password: "password123",
				};

				const { body } = await supertest(app)
					.post("/api/v1/auth/login")
					.send(reqBody)
					.expect(200);

				expect(body).toEqual({
					accessToken: expect.any(String),
					user: {
						_id: user._id.toString(),
						name: user.name,
						username: user.username,
						email: user.email,
						avatar: user.avatar,
						following: user.following,
						followers: user.followers,
						counts: user.counts,
						updatedAt: expect.any(String),
						createdAt: expect.any(String),
					},
				});
			});
		});
	});
});