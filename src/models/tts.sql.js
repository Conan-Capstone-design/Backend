// models/tts.sql.js
// tts 음성 텍스트 저장
export const insertTtsSql =
    "INSERT INTO character_voice (user_id, character_id, title, dialogue_text, voice, created_at) VALUES (?, ?, ?, ?, ?, ?);";
// 저장 음성 전체 보기
export const viewVoiceSql =
    "select user_id, voice_id, character_id, voice, title, dialogue_text, created_at from character_voice where user_id = ?";
// 음성 삭제
export const deleteVoiceSql = 
    "delete from character_voice where voice_id = ? and user_id = ?";