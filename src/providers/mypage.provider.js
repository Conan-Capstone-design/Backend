import { getUserInfoDao, getCommentListDao } from '../models/mypage.dao.js';
import { userDTO, commentListDTO } from '../dtos/mypage.dto.js';

// 사용자 정보 가져오기
export const getUserInfo = async (user_id) => {
    const userInfo = await getUserInfoDao(user_id);
    return userDTO(userInfo);
};

// 사용자 정보 가져오기
export const getCommentList = async (user_id, limit) => {
    const commentList = await getCommentListDao(user_id, limit);
    return commentListDTO(commentList);
};

// 사용자 수정 프로필 가져오기
export const getUserEditInfo = async (user_id) => {
    const userInfo = await getUserInfoEditDao(user_id);
    return userEditDTO(userInfo);
};