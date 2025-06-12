// routes/tts.route.js
import express from "express";
import asyncHandler from "express-async-handler";
import { tts_voice } from "../../config/voice.uploader.js"
import { saveVoice, voiceDelete, voiceAll } from "../controllers/tts.controller.js";
import jwtMiddleware from "../../config/jwtMiddleware.js";


export const ttsRouter = express.Router();

// tts 변환된 음성 저장
ttsRouter.post("/voice-save", jwtMiddleware, tts_voice.single('voice'), asyncHandler(saveVoice));
// 음성 전체 보기
ttsRouter.get("/voice-all", jwtMiddleware, asyncHandler(voiceAll))
// 음성 삭제
ttsRouter.delete('/voice-delete/:voice_id', jwtMiddleware, asyncHandler(voiceDelete))