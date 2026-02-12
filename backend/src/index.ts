import Fastify, { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

import cors from '@fastify/cors';
import websocket from '@fastify/websocket';

dotenv.config();

const server: FastifyInstance = Fastify({
    logger: true
});

server.register(cors, {
    origin: true // Allow all origins for MVP
});

server.register(websocket);

import compileRoutes from './routes/compile';
import wsRoutes from './routes/ws';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import autopilotRoutes from './routes/autopilot';

server.register(compileRoutes);
server.register(wsRoutes);
server.register(authRoutes);
server.register(projectRoutes);
server.register(autopilotRoutes);

server.get('/', async (request, reply) => {
    return { hello: 'world', message: 'Embedded IDE Backend is Running' };
});

const start = async () => {
    try {
        await server.listen({ port: 3001, host: '0.0.0.0' });
        console.log(`Server listening on port 3001`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
