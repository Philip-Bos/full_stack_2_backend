"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database("blogposts.db", (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the blogposts database.");
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Endpoint for creating a new blog post
app.post("/blog-posts", (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).send("Title and body are required");
    }
    const timestamp = Date.now();
    const sql = `INSERT INTO blogposts (title, body, timestamp) VALUES (?, ?, ?)`;
    const params = [title, body, timestamp];
    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to create blog post");
        }
        const id = this.lastID;
        const newBlogPost = { id, title, body, timestamp };
        return res.status(201).json(newBlogPost);
    });
});
// Endpoint for retrieving all blog posts
app.get("/blog-posts", (req, res) => {
    const sql = `SELECT id, title, body, timestamp FROM blogposts`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to retrieve blog posts");
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
app.get("/blog-posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const sql = `SELECT id, title, body, timestamp FROM blogposts WHERE id = ?`;
    const params = [id];
    db.get(sql, params, (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to retrieve blog post");
        }
        if (!row) {
            return res.status(404).send("Blog post not found");
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
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//# sourceMappingURL=app.js.map