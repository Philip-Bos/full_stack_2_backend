# Blog Application Backend

This is the server-side API for a simple web application that allows users to create and view blog posts. The API has been built using Node.js and Express, and TypeScript has been used throughout the codebase to ensure type safety.

## Endpoints

The API has the following endpoints:

- `/blog-posts` (POST): Create a new blog post with a title, body, and timestamp.
- `/blog-posts` (GET): Retrieve all blog posts.
- `/blog-posts/:id` (GET): Retrieve a single blog post by ID.
- `/blog-posts/:id` (DELETE): Delete a blog post by ID.

The API returns appropriate HTTP status codes for each endpoint (e.g. 200 for success, 404 for not found, etc.). SQLite has been used to store the blog posts.

## Implementation Choices

- **SQLite**: I chose to use SQLite for the database because it is lightweight and easy to set up. It also provides good performance for small applications.
- **Error handling**: I added error handling middleware to the server to catch and handle any database errors. I also provided specific error messages to make it easier to understand what went wrong.

## Running the Application

To run the backend application:

1. Clone the repository: `git clone https://github.com/Philip-Bos/full_stack_2_backend.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. The server should now be running on `http://localhost:4000`

## Notes

- This application was built as part of the Match community onboarding process.
- The frontend user interface has been built in a [separate repository](https://github.com/Philip-Bos/full_stack_2_frontend) and is not included in this codebase.
- The code has been written to be as simple and easy to understand as possible, with comments and descriptive variable names.
