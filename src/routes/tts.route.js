// routes/tts.route.js
import express from "express";
import asyncHandler from "express-async-handler";
import { tts_voice } from "../../config/voice.uploader.js"
import { saveVoice } from "../controllers/tts.controller.js";
import jwtMiddleware from "../../config/jwtMiddleware.js";


export const ttsRouter = express.Router();

// 음성, 텍스트 저장
ttsRouter.post("/voice-save", jwtMiddleware, tts_voice.single('voice'), asyncHandler(saveVoice));
// 음성 삭제