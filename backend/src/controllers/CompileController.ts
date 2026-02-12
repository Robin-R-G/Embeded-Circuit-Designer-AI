import { FastifyRequest, FastifyReply } from 'fastify';
import { CompilerService } from '../services/CompilerService';

const compilerService = new CompilerService();

export const compile = async (request: FastifyRequest, reply: FastifyReply) => {
    const { code, board } = request.body as { code: string; board: string };

    if (!code) {
        return reply.status(400).send({ error: 'Code is required' });
    }

    const result = await compilerService.compile(code, board);
    return reply.send(result);
};
