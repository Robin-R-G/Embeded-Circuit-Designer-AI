import { FastifyInstance, FastifyRequest } from 'fastify';
import { CompilerService } from '../services/CompilerService';
import { AIService } from '../services/AIService';

const compilerService = new CompilerService();
const aiService = new AIService();

export default async function autopilotRoutes(fastify: FastifyInstance) {
    fastify.get('/ws/autopilot', { websocket: true }, (connection: any, req: FastifyRequest) => { // Using any for connection to bypass strict types for now

        connection.socket.on('message', async (message: string) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.type === 'generate') {
                    const { prompt, board } = data;

                    connection.socket.send(JSON.stringify({ type: 'status', message: 'Generating code with AI...' }));

                    let code = await aiService.generateCode(prompt, board);

                    if (!code) {
                        connection.socket.send(JSON.stringify({ type: 'error', message: 'Failed to generate code. check API key.' }));
                        return;
                    }

                    connection.socket.send(JSON.stringify({ type: 'code', code }));
                    connection.socket.send(JSON.stringify({ type: 'status', message: 'Code generated. Compiling...' }));

                    // Compilation Loop with Auto-Fix
                    let attempts = 0;
                    const maxAttempts = 3;
                    let success = false;

                    while (attempts < maxAttempts && !success) {
                        attempts++;
                        const result = await compilerService.compile(code!, board);

                        if (result.success) {
                            success = true;
                            connection.socket.send(JSON.stringify({ type: 'status', message: `Compilation successful! (Attempt ${attempts})` }));
                            connection.socket.send(JSON.stringify({ type: 'log', message: result.output }));
                            connection.socket.send(JSON.stringify({ type: 'success', binaryPath: result.binaryPath }));
                        } else {
                            connection.socket.send(JSON.stringify({ type: 'status', message: `Compilation failed (Attempt ${attempts}/${maxAttempts}). Analyzing error...` }));
                            connection.socket.send(JSON.stringify({ type: 'log', message: result.output }));

                            if (attempts < maxAttempts) {
                                const fixedCode = await aiService.getFixSuggestion(code!, result.output);
                                if (fixedCode) {
                                    code = fixedCode;
                                    connection.socket.send(JSON.stringify({ type: 'status', message: 'AI applied a fix. Recompiling...' }));
                                    connection.socket.send(JSON.stringify({ type: 'code', code })); // Update frontend
                                } else {
                                    connection.socket.send(JSON.stringify({ type: 'error', message: 'AI could not find a fix.' }));
                                    break;
                                }
                            }
                        }
                    }

                    if (!success) {
                        connection.socket.send(JSON.stringify({ type: 'error', message: 'Auto-pilot failed to produce a working binary.' }));
                    }
                }
            } catch (error) {
                console.error('WebSocket Error:', error);
                connection.socket.send(JSON.stringify({ type: 'error', message: 'Internal server error' }));
            }
        });
    });
}
