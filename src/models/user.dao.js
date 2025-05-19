// models/user.dao.js

import { pool } from "../../config/db.config";
import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import {
  confirmEmail,
  insertUserSql,
  checkUser,
  insertProfileImageSql,
  repId,
  checkPw
} from "./user.sql.js";

// 모든 유저 조회
export const allUser = async () => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(checkUser);
    conn.release();
    return result;
  } catch (err) {
    console.error("Error acquiring connection:", err);
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

// 회원가입
export const addUser = async (data) => {
  try {
    const conn = await pool.getConnection();

    const [confirm] = await pool.query(confirmEmail, data.email);

    // 이메일 중복시 -1 반환
    if (confirm[0].isExistEmail) {
      conn.release();
      return -1;
    }

    const result = await pool.query(insertUserSql, [
      data.email,
      data.password,
      data.nickname,
      data.option,
      data.created_at
    ]);


    const userId = result[0].insertId;
    console.log(result[0].insertId)

    await conn.query(insertProfileImageSql, [
      userId,
      data.image,
    ]);

    conn.release();
    return result[0].resultId
  } catch (err) {
    console.error("Error acquiring connection:", err);

    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

// 아이디 중복 확인
export const overlapId = async (data) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(repId, [data.email]
    );
    conn.release();
    return result[0];
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

// 비밀번호 확인
export const selectUserPassword = async (data) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(checkPw, [data[0], data[1]]
    );
    conn.release();
    console.log(result)
    return result[0];
  } catch (err) {
    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};