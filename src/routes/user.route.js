// routes/user.route.js
import express from "express";
import asyncHandler from "express-async-handler";

import { allUser, signUp } from "../controllers/user.controller.js";

export const userRouter = express.Router();

// 전체 유저 조회
userRouter.get("/users", asyncHandler(allUser));
// 회원가입 - 이미지는 s3 만들고
userRouter.post('/sign-up', asyncHandler(signUp))