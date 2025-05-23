import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { allUser, overlapId, selectUserPassword, deleteUser } from "../models/user.dao.js";

// 전체 유저 조회
export const Users = async () => {
    try {
        const result = await allUser();
        return result;
    } catch (error) {
        throw error;
    }
}
// 아이디 중복 확인
export const repeatId = async (data) => {
    try{
        const result = await overlapId(data);
        return result;
    } catch (error) {
        throw error;
      }
}
// 비밀번호 확인
export const passwordCheck = async (data) => {
    try {
        console.log(data)
        const result = await selectUserPassword(data);
        return result;
    } catch (error) {
        throw error;
    }
}

// 회원 탈퇴
export const withdrawUser = async (user_id) => {
  try {
    await deleteUser(user_id);
    return;
  } catch (error) {
    throw error;
  }
};
