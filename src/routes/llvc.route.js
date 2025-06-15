// routes/llvc.route.js
import express from "express";
import asyncHandler from "express-async-handler";
import { characterChoice, stopVoiceConversion, convertVideo } from "../controllers/llvc.controller.js";
import jwtMiddleware from "../../config/jwtMiddleware.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // 임시 업로드 폴더

export const llvcRouter = express.Router();

// 실시간 음성 변환 캐릭터 선택
llvcRouter.get("/character/:characternum", jwtMiddleware,  asyncHandler(characterChoice));

// 변환 중지
llvcRouter.post("/stop", jwtMiddleware, asyncHandler(stopVoiceConversion));

// 비디오 변환
llvcRouter.post("/video-convert", jwtMiddleware, upload.single('video'), asyncHandler(convertVideo));
