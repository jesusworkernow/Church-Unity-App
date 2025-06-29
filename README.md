# Church Unity App Express.js API

## Setup

1. Copy `.env.example` to `.env` and update the `DATABASE_URL` for your Postgres instance.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

- `GET /` — Returns `{ message: 'Church Unity App API is running' }`
- `GET /api/test-db` — Returns current Postgres time or error

## YouTube API
- `GET /api/youtube?name=CHURCH_NAME` — Get latest YouTube video for a church
- `GET /api/youtube-latest?church=CHURCH_NAME` — Get latest video for a church (alternate)
- `GET /api/search-church-youtube?churchName=CHURCH_NAME` — Search for a church's latest video

## Donations
- `POST /api/donations` — Placeholder for future donation integration

## Environment Variables
- `DATABASE_URL` — Postgres connection string
- `PORT` — Port to run the server (default: 5000)

## Input Validation & Testing
- Input validation and automated tests are recommended for production. See below for setup.

## Development
- Use `npm run dev` to start with auto-reload (requires `nodemon`).

## Example .env
See `.env.example` for required environment variables.

---

# Input Validation (Recommended)
Install express-validator:
```sh
npm install express-validator
```

# Testing (Recommended)
Install Jest:
```sh
npm install --save-dev jest supertest
```
Add to `package.json`:
```json
"scripts": {
  "test": "jest"
}
```

---

## Deployment Guide

### 1. Prepare for Production
- Ensure your `.env` file is set up with production values (never commit `.env` to git).
- Build any frontend (if you add one) and place static files in `public/`.

### 2. Deploy to a Cloud Platform

#### Option A: Render.com (Easy, Free Tier)
1. Push your code to GitHub.
2. Create a new Web Service on [Render](https://render.com/).
3. Connect your GitHub repo.
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (`DATABASE_URL`, `YOUTUBE_API_KEY`, etc.) in the Render dashboard.
7. Deploy!

#### Option B: Railway.app (Easy, Free Tier)
1. Push your code to GitHub.
2. Create a new project on [Railway](https://railway.app/).
3. Link your repo and set up environment variables.
4. Deploy.

#### Option C: Heroku (Popular, Free Tier with limitations)
1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
2. Run:
   ```sh
   heroku create
   heroku config:set DATABASE_URL=your_db_url YOUTUBE_API_KEY=your_api_key
   git push heroku main
   ```

#### Option D: VPS/Custom Server
1. Copy your code to the server.
2. Install Node.js and dependencies (`npm install`).
3. Set up your `.env` file.
4. Use a process manager like [PM2](https://pm2.keymetrics.io/) to run your app:
   ```sh
   npm install -g pm2
   pm2 start server.js
   ```

### 3. Domain & HTTPS
- Use your platform’s dashboard to add a custom domain and enable HTTPS.

### 4. Database
- Use a managed Postgres service (Render, Railway, Supabase, etc.) or set up your own.
