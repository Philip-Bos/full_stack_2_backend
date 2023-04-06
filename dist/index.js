"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const cors_1 = __importDefault(require("cors"));
const db = new sqlite3_1.default.Database('blogposts.db', (err) => {
    if (err) {
        throw err; // Handle database connection error more gracefully
    }
    console.log('Connected to the blogposts database.');
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Endpoint for creating a new blog post
app.post('/blog-posts', (req, res, next) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' }); // Provide more specific error message
    }
    const timestamp = Date.now();
    const sql = `INSERT INTO blogposts (title, body, timestamp) VALUES (?, ?, ?)`;
    const params = [title, body, timestamp];
    db.run(sql, params, function (err) {
        if (err) {
            next(err); // Pass database error to error handling middleware
            return;
        }
        const id = this.lastID;
        const newBlogPost = { id, title, body, timestamp };
        return res.status(201).json(newBlogPost);
    });
});
//Endpoint for testing on vercel
app.get('/', (req, res) => {
    res.send('Express JS on Vercel');
});
// Endpoint for retrieving all blog posts
app.get('/blog-posts', (req, res, next) => {
    const sql = `SELECT id, title, body, timestamp FROM blogposts`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            next(err); // Pass database error to error handling middleware
            return;
        }
        const blogPosts = rows.map((row) => ({
            id: row.id,
            title: row.title,
            body: row.body,
            timestamp: row.timestamp,
        }));
        return res.json(blogPosts);
    });
});
// Endpoint for retrieving a single blog post by ID
app.get('/blog-posts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT id, title, body, timestamp FROM blogposts WHERE id = ?`;
    const params = [id];
    db.get(sql, params, (err, row) => {
        if (err) {
            next(err); // Pass database error to error handling middleware
            return;
        }
        if (!row) {
            return res.status(404).json({ error: 'Blog post not found' }); // Provide more specific error message
        }
        const blogPost = {
            id: row.id,
            title: row.title,
            body: row.body,
            timestamp: row.timestamp,
        };
        return res.json(blogPost);
    });
});
// Endpoint for deleting a blog post by ID
app.delete('/blog-posts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    const sql = `DELETE FROM blogposts WHERE id = ?`;
    const params = [id];
    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Failed to delete blog post');
        }
        // Check if any row was affected (deleted)
        if (this.changes === 0) {
            return res.status(404).send('Blog post not found');
        }
        return res.status(204).send(); // Return 204 No Content status for successful deletion
    });
});
const port = 4000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=index.js.map