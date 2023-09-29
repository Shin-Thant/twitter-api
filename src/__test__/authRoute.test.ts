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

jest.mock("../util/email", () => ({
	...jest.requireActual("../util/email"),
	async sendWelcomeEmail() {
		console.log("sending welcome email...");
	},
	async sendVerifyEmail() {
		console.log("sending verify email...");
	},
	async sendEmail() {
		console.log("sending...");
	},
}));

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
					{
						body: { email: "hello@gmail.com" },
						errMessage: "Password is required!",
					},
					{
						body: { password: "hello@gmail.com" },
						errMessage: "Email is required!",
					},
					{
						body: { email: 10, password: "hi" },
						errMessage: "Email must be string!",
					},
					{
						body: { email: "hello", password: "hi" },
						errMessage: "Invalid email!",
					},
					{
						body: { email: "hello@gmail", password: "hi" },
						errMessage: "Invalid email!",
					},
					{
						body: { email: "hello@gmail.com", password: 10 },
						errMessage: "Password must be string!",
					},
				];

				for (const item of requestBodyArr) {
					const { body } = await supertest(app)
						.post("/api/v1/auth/login")
						.send(item.body)
						.expect(400);
					expect(body).toEqual({
						status: "fail",
						message: item.errMessage,
					});
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
						emailVerified: user.emailVerified,
						avatar: user.avatar,
						following: user.following,
						followers: user.followers,
						counts: user.counts,
						updatedAt: expect.any(String),
						createdAt: expect.any(String),
						id: user._id.toString(),
					},
				});
			});
		});
	});
});
