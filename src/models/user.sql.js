// models/user.sql.js
// 전체 회원 조회
export const checkUser = "select * from user"

export const insertUserSql =
  "INSERT INTO user (email, password, nickname, `option`, created_at) VALUES (?, ?, ?, ?, ?);";

export const insertProfileImageSql =
  "INSERT INTO user_image (user_id, profile_image) VALUES (?, ?);";
  
export const getUserID = "SELECT * FROM user WHERE user_id = ?";

export const connectFoodCategory =
  "INSERT INTO user_favor_category (f_category_id, member_id) VALUES (?, ?);";

export const confirmEmail =
  "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail";

export const getPreferToUserID =
  "SELECT ufc.uf_category_id, ufc.f_category_id, ufc.user_id, fcl.f_category_name " +
  "FROM user_favor_category ufc JOIN food_category_list fcl on ufc.f_category_id = fcl.f_category_id " +
  "WHERE ufc.user_id = ? ORDER BY ufc.f_category_id ASC;";
// 아이디 중복 확인
export const repId = 
  "select user_id, email from user where email=?";
// 비밀번호 확인
export const checkPw = 
  "select user_id, email, password from user where email=? and password=?";

// 회원 탈퇴
export const deleteUserSql = "DELETE FROM user WHERE user_id = ?";
export const deleteImageSql = "DELETE FROM user_image WHERE user_id = ?";
