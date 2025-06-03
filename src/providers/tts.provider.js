import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { voiceGet } from "../models/tts.dao.js";

// 음성 불러오기
export const getVoice = async (voice_id, user_id) => {
    try {
        const result = await voiceGet(voice_id, user_id);
        console.log("result:",result)
        return result;
    } catch (error) {
        throw error;
    }
}