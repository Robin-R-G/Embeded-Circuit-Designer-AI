import { FastifyInstance, FastifyRequest } from 'fastify';
// import { SocketStream } from '@fastify/websocket';
import { CompilerService } from '../services/CompilerService';
import { AIService } from '../services/AIService';

// Singleton for simplicity in MVP, ideally use dependency injection
const compilerService = new CompilerService();
const aiService = new AIService();

export default async function wsRoutes(fastify: FastifyInstance) {
    fastify.get('/ws/compile', { websocket: true }, (connection: any, req: FastifyRequest) => {

        connection.socket.on('message', async (message: string) => {
            try {
                const data = JSON.parse(message.toString());

                if (data.type === 'compile') {
                    connection.socket.send(JSON.stringify({ type: 'log', message: 'Job queued...' }));

                    const result = await compilerService.compile(data.code, data.board);

                    if (result.success) {
                        connection.socket.send(JSON.stringify({ type: 'log', message: 'Compilation successful!' }));
                        connection.socket.send(JSON.stringify({ type: 'log', message: result.output }));
                        connection.socket.send(JSON.stringify({ type: 'success', binaryPath: result.binaryPath }));
                    } else {
                        connection.socket.send(JSON.stringify({ type: 'log', message: 'Compilation failed.' }));
                        connection.socket.send(JSON.stringify({ type: 'log', message: result.output }));

                        // Auto-fix loop
                        connection.socket.send(JSON.stringify({ type: 'log', message: 'Attempting to auto-fix with AI...' }));
                        const fixedCode = await aiService.getFixSuggestion(data.code, result.output);

                        if (fixedCode) {
                            connection.socket.send(JSON.stringify({ type: 'log', message: 'AI suggested a fix. Recompiling...' }));
                            connection.socket.send(JSON.stringify({ type: 'code_update', code: fixedCode })); // Notify frontend of code change

                            const retryResult = await compilerService.compile(fixedCode, data.board);

                            if (retryResult.success) {
                                connection.socket.send(JSON.stringify({ type: 'log', message: 'Auto-fix successful!' }));
                                connection.socket.send(JSON.stringify({ type: 'log', message: retryResult.output }));
                                connection.socket.send(JSON.stringify({ type: 'success', binaryPath: retryResult.binaryPath }));
                            } else {
                                connection.socket.send(JSON.stringify({ type: 'log', message: 'Auto-fix failed. Please check parameters.' }));
                                connection.socket.send(JSON.stringify({ type: 'log', message: retryResult.output }));
                                connection.socket.send(JSON.stringify({ type: 'error', message: 'Compilation failed after auto-fix.' }));
                            }
                        } else {
                            connection.socket.send(JSON.stringify({ type: 'log', message: 'AI could not find a fix.' }));
                            connection.socket.send(JSON.stringify({ type: 'error', message: 'Compilation failed' }));
                        }
                    }
                }
            } catch (error) {
                connection.socket.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
            }
        });

        connection.socket.on('close', () => {
            // Handle disconnect
        });
    });
}
