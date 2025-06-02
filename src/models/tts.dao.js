// models/tts.dao.js
import { pool } from "../../config/db.config";
import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import {
    insertTtsSql
} from "./tts.sql.js";

// tts 음성 텍스트 저장
export const ttsSave = async (data) => {
    try {
        const conn = await pool.getConnection();

        const result = await pool.query(insertTtsSql, [
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