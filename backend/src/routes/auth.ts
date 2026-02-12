import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/UserService';

const userService = new UserService();

export default async function authRoutes(fastify: FastifyInstance) {
    // Initialize DB table on startup (lazy init)
    await userService.init();

    fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as any;
        if (!email || !password) {
            return reply.status(400).send({ error: 'Email and password required' });
        }
        try {
            const user = await userService.register(email, password);
            return reply.send(user);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    });

    fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = request.body as any;
        try {
            const result = await userService.login(email, password);
            return reply.send(result);
        } catch (error: any) {
            return reply.status(401).send({ error: error.message });
        }
    });
}
