// 메인페이지
// 사용자 정보 가져오기
export const getUserInfoSql = 'SELECT s.email, s.nickname, img.profile_image FROM user AS s JOIN user_image AS img ON s.user_id = img.user_id WHERE s.user_id = ?;';

// 저장한 캐릭터 대사 목록 : limit 2
export const getCommentListSql = 'SELECT c.character, cv.created_at FROM character_voice cv JOIN `character` c ON cv.character_id = c.character_id WHERE cv.user_id = ? ORDER BY cv.created_at DESC LIMIT ?;';

// 대사 저장
// 저장한 캐릭터 대사 목록 : limit x
export const getCommentList2Sql = 'SELECT c.character, cv.created_at FROM character_voice cv JOIN `character` c ON cv.character_id = c.character_id WHERE cv.user_id = ? ORDER BY cv.created_at DESC;';

// 캐릭터 날짜별 대사 모음


// 프로필 수정
export const updateUserProfileSql = (updates) => `UPDATE USER SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = ?;`;
export const updateUserImageSql = 'INSERT INTO user_image (user_id, profile_image) VALUES (?, ?) ON DUPLICATE KEY UPDATE profile_image = VALUES(profile_image);'
export const getProfileUrlSql = 'SELECT profile_image FROM user_image WHERE user_id = ?;';
export const getEmailSql = 'SELECT email FROM USER WHERE user_id = ?;';
export const getNicknameSql = 'SELECT nickname FROM USER WHERE user_id = ?;'

// 사용자 프로필 사진 삭제
export const deleteImageSql = 'UPDATE user_image SET profile_image = NULL WHERE user_id = ?;';


