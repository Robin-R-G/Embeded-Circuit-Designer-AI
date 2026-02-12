import { FastifyInstance } from 'fastify';
import { compile } from '../controllers/CompileController';

export default async function compileRoutes(fastify: FastifyInstance) {
    fastify.post('/compile', compile);
}
