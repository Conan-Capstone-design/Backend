import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import crypto from "crypto";
import jwt from "jsonwebtoken"

import {
    ttsSave, voiceDelete
} from "../models/tts.dao";

// tts 음성 텍스트 저장
export const saveTts = async (body, user_id, voice) => {
    // 시간
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("시간", created_at)

    const result = await ttsSave({
        user_id: user_id,
        character_id: body.character_id,
        title: body.title,
        text: body.dialogue_text,
        voice: voice,
        created_at: created_at
    });
};

// 음성 삭제
export const deleteVoice = async (voice_id, user_id) => {
    const result = await voiceDelete(voice_id, user_id);
};