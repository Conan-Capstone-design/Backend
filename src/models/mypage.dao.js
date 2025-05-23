import { pool } from '../../config/db.config.js';
import { response } from '../../config/response.js';
import { status } from '../../config/response.status.js';
import { getUserInfoSql, getCommentListSql, getCommentList2Sql, updateUserProfileSql, updateUserImageSql, getProfileUrlSql, getNicknameSql, deleteImageSql, getEmailSql, getVoiceListSql, getVoiceListByCharSql, deleteVoiceSql } from './mypage.sql.js';

// 사용자 정보 가져오기
export const getUserInfoDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getUserInfoSql, [user_id]);
        console.log(rows)
        conn.release();
        return rows[0];
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 캐릭터 대사 목록 가져오기
export const getCommentListDao = async (user_id, limit) => {
    try {
        const conn = await pool.getConnection();

        const sql = (limit !== undefined && limit !== null)
            ? getCommentListSql
            : getCommentList2Sql;

        const params = (limit !== undefined && limit !== null)
            ? [user_id, limit]
            : [user_id];

        const [rows] = await conn.query(sql, params);
        conn.release();
        return rows;
    } catch (err) {
        console.error("대사 목록을 가져오는 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

// 저장한 캐릭터 대사 모음
export const getVoiceListDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getVoiceListSql, [user_id]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("getVoiceList 중 오류 발생:", err);
        throw new Error("Database query failed");
    }
};

// 캐릭터별 저장한 캐릭터 대사 모음
export const getVoiceListByCharDao = async (user_id, characterName) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getVoiceListByCharSql, [user_id, characterName]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("getVoiceListByChar 중 오류 발생:", err);
        throw new Error("Database query failed");
    }
};

// 저장한 캐릭터 대사 모음 (삭제)
export const deleteVoiceDao = async (user_id, characterName, voiceId) => {
    const conn = await pool.getConnection();
    await conn.query(deleteVoiceSql, [voiceId, user_id, characterName]);
    conn.release();
};

// 사용자 프로필 수정하기
export const updateUserDao = async (user_id, updatedData) => {
    try {
        const conn = await pool.getConnection();

        // USER 테이블 업데이트
        const userUpdates = [];
        const userParams = [];

        if (updatedData.nickname) {
            userUpdates.push('nickname = ?');
            userParams.push(updatedData.nickname);
        }

        if (updatedData.password) {
            userUpdates.push('password = ?');
            userParams.push(updatedData.password);
        }

        userParams.push(user_id);

        if (userUpdates.length > 0) {
            const userSql = updateUserProfileSql(userUpdates);
            await conn.query(userSql, userParams);
        }

        // user_image 테이블 업데이트
        if (updatedData.photo) {
            await conn.query(updateUserImageSql, [user_id, updatedData.photo]);
        }

        conn.release();
    } catch (err) {
        console.error("사용자 프로필 수정 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
};

//프로필 사진 삭제
export const deleteImageDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(deleteImageSql, [user_id]);
        conn.release();
        return rows[0];
    } catch (err){
        console.error("사진 삭제 중 오류 발생:", err);
        throw response(status.INTERNAL_SERVER_ERROR, {});
    }
}

export const getProfileImageDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getProfileUrlSql,[user_id]);
        conn.release();
        return rows;
    } catch (err) {
        console.error("getProfileImage 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}

export const getEmailDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const email = await conn.query(getEmailSql,[user_id]);
        console.log('email dao : ', email);
        conn.release();
        return email;
    } catch (err) {
        console.error("getEmail 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}

export const getNicknameDao = async (user_id) => {
    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query(getNicknameSql,[user_id]);
        conn.release();
        console.log(rows)
        return rows;
    } catch (err) {
        console.error("getNickname 중 오류 발생:", err); // 에러 로깅
        throw new Error('Database query failed');
    }
}
