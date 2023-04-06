import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import sqlite3, { Database, RunResult } from 'sqlite3';
import cors from 'cors';

interface BlogPost {
  id: number;
  title: string;
  body: string;
  timestamp: number;
}

const db: Database = new sqlite3.Database('blogposts.db', (err: Error | null) => {
  if (err) {
    throw err; // Handle database connection error more gracefully
  }
  console.log('Connected to the blogposts database.');
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint for creating a new blog post
app.post('/blog-posts', (req: Request, res: Response, next: NextFunction) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' }); // Provide more specific error message
  }

  const timestamp = Date.now();

  const sql = `INSERT INTO blogposts (title, body, timestamp) VALUES (?, ?, ?)`;
  const params = [title, body, timestamp];

  db.run(sql, params, function (err: Error | null) {
    if (err) {
      next(err); // Pass database error to error handling middleware
      return;
    }

    const id = this.lastID;
    const newBlogPost: BlogPost = { id, title, body, timestamp };

    return res.status(201).json(newBlogPost);
  });
});

//Endpoint for testing on vercel
app.get('/', (req, res) => {
  res.send('Express JS on Vercel')
})

// Endpoint for retrieving all blog posts
app.get('/blog-posts', (req: Request, res: Response, next: NextFunction) => {
  const sql = `SELECT id, title, body, timestamp FROM blogposts`;

  db.all(sql, [], (err: Error | null, rows: BlogPost[]) => {
    if (err) {
      next(err); // Pass database error to error handling middleware
      return;
    }

    const blogPosts: BlogPost[] = rows.map((row: BlogPost) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      timestamp: row.timestamp,
    }));

    return res.json(blogPosts);
  });
});

// Endpoint for retrieving a single blog post by ID
app.get('/blog-posts/:id', (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);

  const sql = `SELECT id, title, body, timestamp FROM blogposts WHERE id = ?`;
  const params = [id];

  db.get(sql, params, (err: Error | null, row: BlogPost) => {
    if (err) {
      next(err); // Pass database error to error handling middleware
      return;
    }

    if (!row) {
      return res.status(404).json({ error: 'Blog post not found' }); // Provide more specific error message
    }

    const blogPost: BlogPost = {
      id: row.id,
      title: row.title,
      body: row.body,
      timestamp: row.timestamp,
    };

    return res.json(blogPost);
  });
});

// Endpoint for deleting a blog post by ID
app.delete('/blog-posts/:id', (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);

  const sql = `DELETE FROM blogposts WHERE id = ?`;
  const params = [id];

  db.run(sql, params, function (err: Error | null) {
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

const port: number = 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});