import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ProjectService } from '../services/ProjectService';
import jwt from 'jsonwebtoken';

const projectService = new ProjectService();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Middleware to verify JWT (simplified for MVP)
const verifyToken = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('No token');
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        (request as any).user = decoded;
    } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
        throw err; // Stop execution
    }
};

export default async function projectRoutes(fastify: FastifyInstance) {
    await projectService.init();

    fastify.post('/projects', { preHandler: verifyToken }, async (request: FastifyRequest, reply: FastifyReply) => {
        const user = (request as any).user;
        const { name, code } = request.body as any;

        if (!code) return reply.code(400).send({ error: 'Code is required' });

        try {
            const project = await projectService.saveProject(user.id, name || 'Untitled', code);
            return reply.send(project);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    });

    fastify.get('/projects', { preHandler: verifyToken }, async (request: FastifyRequest, reply: FastifyReply) => {
        const user = (request as any).user;
        try {
            const projects = await projectService.getProjects(user.id);
            return reply.send(projects);
        } catch (err: any) {
            return reply.code(500).send({ error: err.message });
        }
    });
}
