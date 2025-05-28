// 메인페이지
// 사용자 정보 가져오기
export const getUserInfoSql = 'SELECT s.email, s.nickname, img.profile_image FROM user AS s JOIN user_image AS img ON s.user_id = img.user_id WHERE s.user_id = ?;';

// 저장한 캐릭터 대사 목록 : limit 2
export const getCommentListSql = 'SELECT c.character, cv.created_at FROM character_voice cv JOIN `character` c ON cv.character_id = c.character_id WHERE cv.user_id = ? ORDER BY cv.created_at DESC LIMIT ?;';

// 대사 저장
// 저장한 캐릭터 대사 목록 : limit x
export const getCommentList2Sql = 'SELECT c.character, cv.created_at FROM character_voice cv JOIN `character` c ON cv.character_id = c.character_id WHERE cv.user_id = ? ORDER BY cv.created_at DESC;';

// 저장한 캐릭터 대사 모음
export const getVoiceListSql = `
WITH ranked_voice AS (
    SELECT character_id, created_at,
           ROW_NUMBER() OVER (
             PARTITION BY character_id
             ORDER BY created_at ASC, voice_id ASC
           ) AS rn
    FROM character_voice
    WHERE user_id = ?
)
SELECT c.\`character\`, rv.created_at
FROM ranked_voice rv
JOIN \`character\` c ON rv.character_id = c.character_id
WHERE rv.rn = 1;
`;
// 캐릭터별 저장한 캐릭터 대사 모음
export const getVoiceListByCharSql= `
    SELECT rv.dialogue_text, rv.created_at, rv.voice_id, rv.voice
    FROM character_voice rv
    JOIN \`character\` c ON rv.character_id = c.character_id
    WHERE rv.user_id = ? AND c.\`character\` = ?
    ORDER BY rv.created_at ASC;
  `;

// 
export const deleteVoiceSql='DELETE rv FROM character_voice rv JOIN \`character\` c ON rv.character_id = c.character_id WHERE rv.voice_id = ? AND rv.user_id = ? AND c.\`character\` = ?'


// 프로필 수정
export const updateUserProfileSql = (updates) =>
    `UPDATE user SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = ?;`;
export const updateUserImageSql = 'INSERT INTO user_image (user_id, profile_image) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_image = VALUES(profile_image);'
export const getProfileUrlSql = 'SELECT profile_image FROM user_image WHERE user_id = ?;';
export const getEmailSql = 'SELECT email FROM user WHERE user_id = ?;';
export const getNicknameSql = 'SELECT nickname FROM user WHERE user_id = ?;'

// 사용자 프로필 사진 삭제
export const deleteImageSql = 'UPDATE user_image SET profile_image = NULL WHERE user_id = ?;';


