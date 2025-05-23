// routes/user.route.js
import express from "express";
import asyncHandler from "express-async-handler";
import { imageUploader_profile } from "../../config/image.uploader.js"
import { allUser, signUp, login, withdraw } from "../controllers/user.controller.js";
import jwtMiddleware from "../../config/jwtMiddleware.js";


export const userRouter = express.Router();

// 전체 유저 조회
userRouter.get("/users", asyncHandler(allUser));
// 회원가입
userRouter.post('/sign-up', imageUploader_profile.single("image"), asyncHandler(signUp))
// 로그인
userRouter.post('/login', asyncHandler(login))
// 회원 탈퇴
userRouter.post("/withdraw", jwtMiddleware, asyncHandler(withdraw))
