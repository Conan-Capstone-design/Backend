import { join } from 'path';
import { spawn } from 'child_process';
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

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
