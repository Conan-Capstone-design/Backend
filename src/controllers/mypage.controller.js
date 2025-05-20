// mypageController.js
import { response } from '../../config/response.js'; 
import { status } from '../../config/response.status.js'; 
import { editImageProfile, deleteS3Object, renameS3Object } from '../../config/image.uploader.js';
import path from "path";

import { getUserInfo, getCommentList, getVoiceList, getVoiceListByChar, deleteVoice } from '../providers/mypage.provider.js'; 
import { getNicknameDao, getProfileImageDao, deleteImageDao, getEmailDao } from '../models/mypage.dao.js'; 
import { updateUser } from '../services/mypage.service.js'

// 마이페이지 메인 화면
export const getMyPageMainCon = async (req, res) => {
    try {
        const userInfo = await getUserInfo(req.verifiedToken.user_id);
        const commentList = await getCommentList(req.verifiedToken.user_id, 2);

        res.send(response(status.SUCCESS, {
            user: userInfo,
            commentList: commentList
        }));
    } catch (error) {
        console.error("마이페이지 메인 화면 정보를 가져오는 중 오류 발생:", error);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음
export const getVoiceListCon = async (req, res) => {
    try {
        const result = await getVoiceList(req.verifiedToken.user_id);
        res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("저장한 캐릭터 대사 모음을 가져오는 중 오류 발생:", err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음 (캐릭터 날짜 별)
export const getVoiceListByCharCon = async (req, res) => {
    try {
        const characterName = req.params.characterName;

        const result = await getVoiceListByChar(req.verifiedToken.user_id, characterName);
        res.send(response(status.SUCCESS, result));
    } catch (err) {
        console.error("저장한 캐릭터 대사 모음을 가져오는 중 오류 발생:", err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 저장한 캐릭터 대사 모음 (삭제)
export const deleteVoiceCon = async (req, res) => {
    try {
        const user_id = req.verifiedToken.user_id;
        const { characterName, voiceId } = req.params;

        await deleteVoice(user_id, characterName, voiceId);
        res.send(response(status.SUCCESS, {}));
    } catch (err) {
        console.error('캐릭터 대사 삭제 중 오류 발생:', err);
        res.send(response(status.INTERNAL_SERVER_ERROR, {}));
    }
};

// 프로필 수정
export const updateUserCon = async (req, res) => {
    editImageProfile.single('profile_img')(req, res, async (err) => {
        if (err) {
            console.error("profile_img를 업로드하는 중 오류 발생:", err);
            return res.send(response(status.INTERNAL_SERVER_ERROR, { message: err.message }));
        }

        try {
            // 모든 값이 비어 있는지 확인
            const isEmptyRequest = !req.body.nickname && !req.body.password && !req.file;
            console.log(isEmptyRequest)
            if (isEmptyRequest) {
                // 기존 닉네임을 가져와서 설정
                const originalData = await getNicknameDao(req.verifiedToken.user_id);
                const originalNickname = originalData[0].nickname; // 실제 닉네임 추출
                req.body.nickname = originalNickname;
            }
            // 프로필 데이터를 준비
            const profileData = {
                nickname: req.body.nickname,
                password: req.body.password,
                photo: req.file ? req.file.location : null // 파일이 있는 경우에만 설정
            };

            console.log(profileData)

            // 사진이 없는 경우 또는 모든 값이 비어 있는 경우
            if (profileData.photo == null || isEmptyRequest) {
                const profileUrls = await getProfileImageDao(req.verifiedToken.user_id);
                console.log("profileURLS : ", profileUrls)
                if (profileUrls.length > 0 && profileUrls[0].profile_img !== null) {
                    const profileUrl = profileUrls[0].profile_image;
                    const key = profileUrl.split(".com/")[1].split("?")[0]; // S3 키 추출
                    console.log(`삭제할 키: ${key}`);

                    // S3에서 이미지 삭제
                    await deleteS3Object(key);

                    // 데이터베이스에서 프로필 이미지 URL 삭제
                    await deleteImageDao(req.verifiedToken.user_id);
                    profileData.photo = null; // 이미지 삭제 후 null로 설정
                }
            } else {
                // 사진이 있는 경우 (새로 업로드하는 경우)
                const oldUrl = req.file.location;
                const oldKey = oldUrl.split('https://conan.s3.ap-northeast-2.amazonaws.com/')[1];
                const fileExtension = path.extname(oldKey);

                const emailResult = await getEmailDao(req.verifiedToken.user_id);
                const email = emailResult[0][0].email;
                const newKey = `profile/${email}${fileExtension}`;

                await renameS3Object(oldKey, newKey);

                const timestamp = new Date().getTime();
                profileData.photo = `https://conan.s3.ap-northeast-2.amazonaws.com/${newKey}?timestamp=${timestamp}`;
            }

            // 프로필 정보 업데이트
            const result = await updateUser(req.verifiedToken.user_id, profileData);
            res.send(response(status.SUCCESS, result));
        } catch (error) {
            console.error("프로필 정보를 업데이트하는 중 오류 발생:", error);
            res.send(response(status.INTERNAL_SERVER_ERROR, {}));
        }
    });
};