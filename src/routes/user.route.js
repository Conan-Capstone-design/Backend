// routes/user.route.js
import express from "express";
import asyncHandler from "express-async-handler";
import { imageUploader_profile } from "../../config/image.uploader.js"
import { allUser, signUp } from "../controllers/user.controller.js";

export const userRouter = express.Router();

// 전체 유저 조회
userRouter.get("/users", asyncHandler(allUser));
// 회원가입
userRouter.post('/sign-up', imageUploader_profile.single("image"), asyncHandler(signUp))