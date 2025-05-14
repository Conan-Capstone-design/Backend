import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";
import { signinResponseDTO, existEmail } from "../dtos/user.dto";
import {
  addUser,
  getUser,
  getUserPreferToUserID,
  setPrefer,
} from "../models/user.dao";

export const joinUser = async (body) => {
  const created_at = new Date();

  const joinUserData = await addUser({
    email: body.email,
    password: body.password,
    nickname: body.nickname,
    option: body.option,
    created_at: created_at
  });

  if (joinUserData == -1) {
    throw new BaseError(status.EMAIL_ALREADY_EXIST);
  } else {
    // for (let i = 0; i < prefer.length; i++) {
    //   await setPrefer(joinUserData, prefer[i]);
    // }
    return signinResponseDTO(
      await getUser(joinUserData)
      //   await getUserPreferToUserID(joinUserData)
    );
  }
};
