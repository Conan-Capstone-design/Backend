import { join } from 'path';
import { spawn } from 'child_process';
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import fs from 'fs';


let pythonProcess = null;

export const characterChoice = async (req, res, next) => {
    console.log("실시간 음성 변환 캐릭터 선택");

    if (pythonProcess) {
        pythonProcess.kill('SIGTERM'); // 기존 프로세스 종료
    }

    const character = req.params.characternum;

    const modelDir = join(__dirname, '../../llvc_model_server');

    pythonProcess = spawn('python3', [
        'realtime_vc.py',
        '--checkpoint_path', 'G_765000.pth',
        '--config_path', 'config.json',
        '--target_index', character
    ], {
        cwd: modelDir
    });

    pythonProcess.stdout.on('data', (data) => {
        console.log(`[PYTHON STDOUT] ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`[PYTHON STDERR] ${data}`);
    });

    pythonProcess.on('close', (code) => {
        // 실시간 음성 변환 프로세스가 종료되면 클라이언트에 응답
        res.send(response(status.SUCCESS, { result: "실시간 음성 변환 실행 완료", code }));
    });
};

// 변환 중지
export const stopVoiceConversion = async (req, res) => {
    if (pythonProcess) {
        pythonProcess.kill('SIGTERM');
        pythonProcess = null;
        res.send(response(status.SUCCESS, { result: "실시간 음성 변환 중지됨" }));
    } else {
        res.send(response(status.NO_PROCESS, { result: "실행 중인 프로세스 없음" }));
    }
};

import axios from 'axios';
import FormData from 'form-data';
// import fs from 'fs';

// EC2 IP와 포트
const EC2_API_URL = 'http://13.125.234.145:8080/video-convert';

export const convertVideo = async (req, res) => {
    try {
        const inputFile = req.file;
        const targetIndex = req.body.targetIndex;

        if (!inputFile) {
            return res.status(400).json({ error: '비디오 파일이 필요합니다.' });
        }

        // EC2에 보낼 form-data 구성
        const formData = new FormData();
        formData.append('video', fs.createReadStream(inputFile.path));
        formData.append('targetIndex', targetIndex);
        console.log("구성!")

        // EC2에 요청
        const ec2Response = await axios.post(EC2_API_URL, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            responseType: 'stream', // 🔥 파일 받을 때 중요!
        });

        // // 업로드 후 input 파일 정리
        // fs.unlinkSync(inputFile.path);

        // const { outputFile, outputPath } = ec2Response.data;
        // 🔥 파일 스트림 그대로 사용자에게 전달
        res.setHeader('Content-Disposition', 'attachment; filename=converted.mp4');
        ec2Response.data.pipe(res);
        // return res.status(200).json({
        //   message: '변환 완료',
        //   outputFile,
        //   outputPath, // 필요에 따라 S3로 올리거나 EC2에서 직접 다운로드 처리
        // });

    } catch (error) {
        console.error('[EB → EC2 ERROR]', error.message);
        return res.status(500).json({ error: 'EC2 변환 요청 실패' });
    }
};