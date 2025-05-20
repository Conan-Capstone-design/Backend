import { getUserInfoDao, getCommentListDao, getVoiceListDao, getVoiceListByCharDao, deleteVoiceDao } from '../models/mypage.dao.js';
import { userDTO, commentListDTO, voiceListDTO, voiceListByCharDTO } from '../dtos/mypage.dto.js';

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

// 저장한 캐릭터 대사 모음
export const getVoiceList = async (user_id) => {
    const voiceList = await getVoiceListDao(user_id);
    return voiceListDTO(voiceList);
};

// 저장한 캐릭터 대사 모음 (캐릭터 날짜 별)
export const getVoiceListByChar = async (user_id, characterName) => {
  const rawList = await getVoiceListByCharDao(user_id, characterName);
  return voiceListByCharDTO(rawList);
};

// 저장한 캐릭터 대사 모음 (삭제)
export const deleteVoice = async (user_id, characterName, voiceId) => {
    return await deleteVoiceDao(user_id, characterName, voiceId);
};

// 사용자 수정 프로필 가져오기
export const getUserEditInfo = async (user_id) => {
    const userInfo = await getUserInfoEditDao(user_id);
    return userEditDTO(userInfo);
};