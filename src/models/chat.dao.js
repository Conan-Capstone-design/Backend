import { pool } from '../../config/db.config.js';
import { getCharacterIdByNameSQL, getExistingRoomSQL, createChatRoomSQL, getChatByChatIdSQL, saveMessageSQL, getNameByChatIdSQL, getChatListSQL } from '../models/chat.sql.js';

// 캐릭터 이름으로 ID 조회
export const getCharacterIdByNameDAO = async (characterName) => {
    const [rows] = await pool.query(getCharacterIdByNameSQL, [characterName]);
    return rows.length > 0 ? rows[0].character_id : null;
};

// 기존 방 존재 여부 확인
export const getExistingRoomDAO = async (userId, characterId) => {
    const [rows] = await pool.query(getExistingRoomSQL, [userId, characterId]);
    return rows.length > 0 ? rows[0].chat_id : null;
};

// 새로운 방 생성
export const createRoomDAO = async (userId, characterId) => {
    const [result] = await pool.query(createChatRoomSQL, [userId, characterId]);
    return result.insertId;
};

// 특정 chat_id에 해당하는 메시지 전체 조회
export const getChatByChatIdDAO = async (chatId) => {
    const [rows] = await pool.query(getChatByChatIdSQL, [chatId]);
    return rows;
};

// GPT 초기 메시지 저장
export const saveMessageDAO = async (chatId, role, content) => {
    await pool.query(saveMessageSQL,[chatId, role, content]);
};

// 챗아이디로 이름 찾기
export const getNameByChatIdDAO = async (chatId) => {
  const [rows] = await pool.query(getNameByChatIdSQL, [chatId]);
  return rows.length > 0 ? rows[0].character : null;
};

// 채팅방 목록 불러오기
export const getChatListDAO = async (userId) => {
  const [rows] = await pool.query(getChatListSQL, [userId]);
  return rows;
};