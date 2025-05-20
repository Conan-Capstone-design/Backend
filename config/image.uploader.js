import { S3Client, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import path from "path"
import multer from "multer"
import { slugify } from 'transliteration';
import multerS3 from "multer-s3"

const allowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".PNG",
    ".JPG",
    ".JPEG",
    ".BMP",
];

import { region, accessKeyId, secretAccessKey } from "./s3.js"
export const s3 = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

// 프로필 이미지 업로더
export const imageUploader_profile = multer({
    storage: multerS3({
        s3: s3,
        bucket: "conan",
        key: async function (req, file, callback) {
            const uploadDirectory = "profile";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            callback(null, `${uploadDirectory}/${req.body.email}${extension}`);
        },
        // 🔥 이 부분 추가 (기본 ACL 강제 무력화)
        acl: (req, file, cb) => cb(null, undefined),
    }),
});

// 프로필 이미지 수정 업로더
export const editImageProfile = multer({
    storage: multerS3({
        s3: s3,
        bucket: "conan",
        key: async function (req, file, callback) {
            const uploadDirectory = "profile";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            callback(null, `${uploadDirectory}/${req.body.email}${extension}`);
        },
        // 🔥 이것도 반드시 추가
        acl: (req, file, cb) => cb(null, undefined),
    }),
});

export const deleteS3Object = async (key) => {
    const params = {
        Bucket: "conan",
        Key: key,
    };

    try {
        const data = await s3.send(new DeleteObjectCommand(params));
        console.log('Delete Success! :', data);
    } catch (error) {
        console.error('S3에서 파일 삭제 중 오류 발생:', error);
        throw error;
    }
};

export const renameS3Object = async (oldKey, newKey) => {
    try {
        // 이미지 복사
        await s3.send(new CopyObjectCommand({
            Bucket: "conan",
            CopySource: `conan/${oldKey}`,
            Key: newKey,
        }));

        // 기존 이미지 삭제
        await deleteS3Object(oldKey);
    } catch (error) {
        console.error('S3 객체 이름 변경 중 오류 발생:', error);
        throw error;
    }
};