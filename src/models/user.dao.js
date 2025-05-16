// models/user.dao.js

import { pool } from "../../config/db.config";
import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import {
  connectFoodCategory,
  confirmEmail,
  getUserID,
  insertUserSql,
  getPreferToUserID,
  checkUser,
  insertProfileImageSql
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

// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    const conn = await pool.getConnection();

    const [user] = await pool.query(getUserID, userId);

    console.log(user);

    if (user.length == 0) {
      return -1;
    }

    conn.release();
    return user;
  } catch (err) {
    console.error("Error acquiring connection:", err);

    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

// 음식 선호 카테고리 매핑
export const setPrefer = async (userId, foodCategoryId) => {
  try {
    const conn = await pool.getConnection();

    await pool.query(connectFoodCategory, [foodCategoryId, userId]);

    conn.release();

    return;
  } catch (err) {
    console.error("Error acquiring connection:", err);

    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferToUserID = async (userID) => {
  try {
    const conn = await pool.getConnection();
    const prefer = await pool.query(getPreferToUserID, userID);

    conn.release();

    return prefer;
  } catch (err) {
    console.error("Error acquiring connection:", err);

    throw new BaseError(status.PARAMETER_IS_WRONG);
  }
};
