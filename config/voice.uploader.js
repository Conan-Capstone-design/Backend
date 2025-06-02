import { S3Client, DeleteObjectCommand, CopyObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import path from "path"
import multer from "multer"
import { slugify } from 'transliteration';
import multerS3 from "multer-s3"

const allowedExtensions = [
    ".wav", ".mp3", ".WAV", ".MP3"
];

import { region, accessKeyId, secretAccessKey } from "./s3.js"
export const s3 = new S3Client({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});


// tts 음성
export const tts_voice = multer({
    storage: multerS3({
        s3: s3,
        bucket: "conan",
        key: async function (req, file, callback) {
            const uploadDirectory = "tts";
            const extension = path.extname(file.originalname);
            if (!allowedExtensions.includes(extension)) {
                return callback(new Error("wrong extension"));
            }
            callback(null, `${uploadDirectory}/${req.verifiedToken.user_id}${extension}`);
        },
    }),
});