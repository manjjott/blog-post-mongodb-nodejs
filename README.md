# Interactive Blog Post Web Application

A small CRUD blog application built with Node.js, Express, EJS, and MongoDB. Users can create, list, read, edit, and delete blog posts stored in MongoDB.

## Features

- Create posts with a title, summary, content, and author.
- View all posts ordered by most recent first.
- Read individual post details with formatted publication dates.
- Edit existing posts.
- Delete posts from the list page.
- Render friendly 404 and 500 error pages.

## Requirements

- Node.js
- npm
- MongoDB running locally or reachable via a connection string

## Getting Started

Install dependencies:

```bash
npm install
```

Start MongoDB and ensure an `authors` collection exists in the `blog` database. Example author document:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com"
}
```

Run the application:

```bash
npm start
```

The app listens on `http://localhost:3000` by default.

## Configuration

The following environment variables are optional:

- `PORT` - server port. Defaults to `3000`.
- `MONGODB_URL` - MongoDB connection URL. Defaults to `mongodb://127.0.0.1:27017`.
- `MONGODB_DATABASE` - database name. Defaults to `blog`.

## Development

Run the app with automatic restarts:

```bash
npm run dev
```

Run syntax checks:

```bash
npm run check
```
