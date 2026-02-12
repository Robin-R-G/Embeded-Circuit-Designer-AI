import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
const { v4: uuidv4 } = require('uuid');
import PQueue from 'p-queue';

const execPromise = util.promisify(exec);

export class CompilerService {
    private tempDir: string;
    private queue: PQueue;

    private readonly BOARD_CONFIGS: Record<string, { image: string, command: string, extension: string }> = {
        'esp32': {
            image: 'espressif/idf:latest',
            command: 'idf.py build',
            extension: 'main.cpp'
        },
        'esp8266': {
            image: 'arduino:latest', // Placeholder for Arduino CLI with ESP8266 core
            command: 'arduino-cli compile --fqbn esp8266:esp8266:nodemcuv2 /project',
            extension: 'main.ino'
        }
    };

    constructor() {
        this.tempDir = path.resolve(__dirname, '../../temp');
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        this.queue = new PQueue({ concurrency: 2 }); // Limit to 2 concurrent compilations
    }

    async compile(code: string, board: string = 'esp32'): Promise<{ success: boolean; output: string; binaryPath?: string }> {
        return this.queue.add(() => this._compileJob(code, board));
    }

    private async _compileJob(code: string, board: string): Promise<{ success: boolean; output: string; binaryPath?: string }> {
        const config = this.BOARD_CONFIGS[board] || this.BOARD_CONFIGS['esp32'];

        const jobId = uuidv4();
        const jobDir = path.join(this.tempDir, jobId);
        fs.mkdirSync(jobDir);

        const sourceFile = path.join(jobDir, config.extension);
        fs.writeFileSync(sourceFile, code);

        // Docker command to run compilation
        // Mounts the job directory to /project in the container
        const command = `docker run --rm -v "${jobDir}:/project" -w /project ${config.image} ${config.command}`;

        try {
            const { stdout, stderr } = await execPromise(command);

            // Check for build artifact (e.g., build/project-name.bin)
            // For MVP, we assume a standard output name or find the .bin file
            const binPath = path.join(jobDir, 'build/main.bin'); // Adjust based on project name
            const exists = fs.existsSync(binPath);

            return {
                success: exists,
                output: stdout + (stderr ? `\nStderr:\n${stderr}` : ''),
                binaryPath: exists ? binPath : undefined,
            };
        } catch (error: any) {
            return {
                success: false,
                output: error.message || String(error),
            };
        }
    }
}
