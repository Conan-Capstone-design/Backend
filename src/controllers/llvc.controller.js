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

// 비디오 변환
export const convertVideo = async (req, res, next) => {
    try {
        console.log("비디오 변환 시작");

        // Postman에서 파일 업로드 (req.file) 및 targetIndex 받기
        const inputFile = req.file; // 업로드된 파일
        const targetIndex = req.body.targetIndex; // 숫자로 받기 (기본값 1)

        // 상대경로로 모델 디렉토리 지정
        const modelDir = join(__dirname, '../../llvc_model_server');

        // 업로드된 파일을 모델 디렉토리로 복사 (임시)
        const inputPath = join(modelDir, inputFile.originalname);
        console.log("inputPath:", inputPath)
        fs.copyFileSync(inputFile.path, inputPath);

        // 출력 파일 경로
        const outputFileName = `${inputFile.originalname.replace('.mp4', '')}_output.mp4`;
        const outputPath = join(modelDir, outputFileName);

        // 체크포인트 및 설정 파일 경로
        const checkpointPath = join(modelDir, 'G_765000.pth');
        const configPath = join(modelDir, 'config.json');

        // Python 스크립트 실행 (상대경로 사용)
        pythonProcess = spawn('python3', [
            join(modelDir, 'video_voice_transformer.py'),
            '-i', inputPath,
            '-o', outputPath,
            '-c', checkpointPath,
            '--config', configPath,
            '-t', targetIndex.toString()
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
            if (code === 0) {
                // 변환된 영상 파일을 response로 전송
                res.download(outputPath, outputFileName, (err) => {
                    if (err) {
                        console.error('파일 전송 실패:', err);
                        res.status(500).json(response(status.INTERNAL_SERVER_ERROR, { error: "파일 전송 실패" }));
                    }
                    // 임시 파일 정리
                    fs.unlinkSync(inputPath);
                    fs.unlinkSync(outputPath);
                    fs.unlinkSync(inputFile.path);
                    // audio 파일(wav)도 삭제
                    const baseName = inputPath.replace(/\.[^/.]+$/, "");
                    const origWav = baseName + '.wav';
                    const modWav = baseName + '_modulated.wav';
                    if (fs.existsSync(origWav)) fs.unlinkSync(origWav);
                    if (fs.existsSync(modWav)) fs.unlinkSync(modWav);

                });
            } else {
                res.status(500).json(response(status.INTERNAL_SERVER_ERROR, { error: "비디오 변환 실패" }));
            }
        });

    } catch (error) {
        console.error('[NODE ERROR]', error);
        res.status(500).json(response(status.INTERNAL_SERVER_ERROR, { error: error.message }));
    }
};
