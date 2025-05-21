/// 대화하기 시작 : 이전 대화 기록이 있으면 가져오고, 아니면 새로 시작
/// 캐릭터 이름으로 character_id 조회
export const getCharacterIdByNameSQL = 'SELECT character_id FROM `character` WHERE `character` = ?'
// 기존 채팅방 존재 여부
export const getExistingRoomSQL = `SELECT chat_id FROM character_chat WHERE user_id = ? AND character_id = ?`;

// 채팅방 생성
export const createChatRoomSQL = `INSERT INTO character_chat (user_id, character_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())`;

// 채팅 내역 조회
export const getChatByChatIdSQL = `SELECT role, content FROM chatting WHERE chat_id = ? ORDER BY content_id ASC`;

// 메시지 저장
export const saveMessageSQL = `INSERT INTO chatting (chat_id, role, content) VALUES (?, ?, ?)`;

// 채팅방 아이디로 캐릭터 이름 불러오기
export const getNameByChatIdSQL = 'SELECT c.character FROM character_chat cc JOIN `character` c ON cc.character_id = c.character_id WHERE cc.chat_id = ?';

// 채팅방 목록
export const getChatListSQL =
  'SELECT c.character, MAX(cc.updated_at) as last_chat_at ' +
  'FROM character_chat cc ' +
  'JOIN `character` c ON cc.character_id = c.character_id ' +
  'WHERE cc.user_id = ? ' +
  'GROUP BY cc.character_id ' +
  'ORDER BY last_chat_at DESC';
