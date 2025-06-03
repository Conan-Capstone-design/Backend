// models/tts.sql.js
// tts 음성 텍스트 저장
export const insertTtsSql =
    "INSERT INTO character_voice (user_id, character_id, dialogue_text, voice, created_at) VALUES (?, ?, ?, ?, ?);";
// 음성 불러오기
export const getVoiceSql =
    "select voice_id, voice from character_voice where voice_id = ? and user_id = ?"
