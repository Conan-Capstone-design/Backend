import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

import { joinUser } from "../services/user.service.js";
import { Users } from "../providers/user.provider.js";

// 전체 회원 조회
export const allUser = async (req, res, next) => {
  console.log("전체 회원 조회");

  res.send(response(status.SUCCESS, await Users()));
};


export const signUp = async (req, res, next) => {
  console.log("회원가입을 요청하였습니다!");
  console.log("body:", req.body);

  // image
  var imageURL;
  if (req.file) {
      imageURL = req.file.location;
  } else {
      imageURL = null;
  }
  console.log("imageURL:", imageURL)

  res.send(response(status.SUCCESS, await joinUser(req.body, imageURL)));
};
