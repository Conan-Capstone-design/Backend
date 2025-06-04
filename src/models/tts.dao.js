// models/tts.dao.js
import { pool } from "../../config/db.config";
import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import {
    insertTtsSql, getVoiceSql, deleteVoiceSql, viewVoiceSql
} from "./tts.sql.js";

// tts 음성 텍스트 저장
export const ttsSave = async (data) => {
    try {
        const conn = await pool.getConnection();

        const result = await conn.query(insertTtsSql, [
            data.user_id,
            data.character_id,
            data.text,
            data.voice,
            data.created_at
        ]);

        conn.release();
        return result[0].resultId
    } catch (err) {
        console.error("Error acquiring connection:", err);

        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 저장 음성 전체 보기
export const allVoice = async (user_id) => {
    try {
        const conn = await pool.getConnection();

        const result = await conn.query(viewVoiceSql, user_id);

        conn.release();
        console.log(result)
        return result[0]
    } catch (err) {
        console.error("Error acquiring connection:", err);

        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 음성 불러오기
export const voiceGet = async (voice_id, user_id) => {
    try {
        const conn = await pool.getConnection();

        const result = await conn.query(getVoiceSql, [
            voice_id,
            user_id
        ]);

        conn.release();
        console.log(result)
        return result[0][0]
    } catch (err) {
        console.error("Error acquiring connection:", err);

        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

// 음성 삭제
export const voiceDelete = async (voice_id, user_id) => {
    try {
        const conn = await pool.getConnection();
        const result = await conn.query(deleteVoiceSql, [
            voice_id,
            user_id
        ]);

        conn.release();
        console.log(result)
        return result[0][0]
    } catch (err) {
        console.error("Error acquiring connection:", err);

        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};