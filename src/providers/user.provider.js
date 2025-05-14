import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { allUser } from "../models/user.dao.js";

// 전체 유저 조회
export const Users = async() => {
    try{    
        const result = await allUser();
        return result;
    } catch(error){
        throw error;
    }
}