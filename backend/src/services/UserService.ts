import { getDb } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class UserService {

    async init() {
        const db = await getDb();
        await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    }

    async register(email: string, password: string) {
        const db = await getDb();
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        try {
            const result = await db.run(
                'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                [email, hash]
            );
            return { id: result.lastID, email };
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT') { // Unique violation
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    async login(email: string, password: string) {
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return { token, user: { id: user.id, email: user.email } };
    }
}
