import { getDb } from '../db';

export class ProjectService {

    async init() {
        const db = await getDb();
        await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);
    }

    async saveProject(userId: number, name: string, code: string) {
        const db = await getDb();
        // For MVP, we'll just insert a new project or update if we implement ID tracking on frontend
        // Simple approach: Insert new each time for "Save As" behavior, or update last one?
        // Let's implement "Upsert" logic based on name for simplicity in MVP, or just insert.
        // Better: Allow saving as "Untitled" or specific name.

        // Check if project exists for user with same name
        const existing = await db.get('SELECT id FROM projects WHERE user_id = ? AND name = ?', [userId, name]);

        if (existing) {
            await db.run('UPDATE projects SET code = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [code, existing.id]);
            return { id: existing.id, name, code };
        } else {
            const result = await db.run(
                'INSERT INTO projects (user_id, name, code) VALUES (?, ?, ?)',
                [userId, name, code]
            );
            return { id: result.lastID, name, code };
        }
    }

    async getProjects(userId: number) {
        const db = await getDb();
        return db.all('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC', [userId]);
    }
}
