// models/user.sql.js

export const insertUserSql =
  "INSERT INTO member (email, name, gender, age, address, spec_address, phone_num) VALUES (?, ?, ?, ?, ?, ?, ?);";

export const getUserID = "SELECT * FROM member WHERE id = ?";

export const connectFoodCategory =
  "INSERT INTO user_favor_category (f_category_id, member_id) VALUES (?, ?);";

export const confirmEmail =
  "SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail";

export const getPreferToUserID =
  "SELECT ufc.uf_category_id, ufc.f_category_id, ufc.user_id, fcl.f_category_name " +
  "FROM user_favor_category ufc JOIN food_category_list fcl on ufc.f_category_id = fcl.f_category_id " +
  "WHERE ufc.user_id = ? ORDER BY ufc.f_category_id ASC;";
