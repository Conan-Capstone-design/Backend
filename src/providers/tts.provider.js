import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { allVoice } from "../models/tts.dao.js";

// 저장 음성 전체 보기
export const viewVoice = async (user_id) => {
    try {
        const result = await allVoice(user_id);
        console.log("result:",result)
        return result;
    } catch (error) {
        throw error;
    }
}