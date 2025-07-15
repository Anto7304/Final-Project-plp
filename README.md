# Final Project: Full Stack Blog Platform

## Overview
A modern full stack blog platform with authentication, user management, posts, comments, and admin features.

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Express.js + MongoDB

---

## Example Admin User (for Demo)

You can use this account to log in as an admin and try all features:

- **Email:** admin@blogs.com
- **Password:** admin123

---

## Features

- User registration, login, JWT authentication
- Role-based access (admin/user)
- Create, edit, delete posts and comments
- Like/unlike comments
- User profile management
- Admin user management (suspend, delete, reset password, change role)
- Flag/unflag posts and comments, admin moderation
- Audit logging & real-time monitoring
- API documentation (Swagger)
- Dockerized for easy deployment

---

## Folder Structure

```
finalProject/
  backend/      # Express.js API, MongoDB models, controllers, routes
  fronted/      # React frontend (Vite, Tailwind CSS)
  README.md     # (this file)
```

---

## Backend Setup

1. **Install dependencies**
   ```sh
   cd backend
   pnpm install
   # or
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and fill in your values.

   **Required environment variables:**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Run the server**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```

4. **API Docs**
   - Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

5. **Monitoring**
   - Visit [http://localhost:5000/api/monitor](http://localhost:5000/api/monitor) (localhost only in production)

---

## Frontend Setup

1. **Install dependencies**
   ```sh
   cd fronted
   pnpm install
   # or
   npm install
   ```

2. **Configure environment**
   - If needed, copy `.env.example` to `.env` and set API base URL.
   - By default, the frontend proxies `/api` to `http://localhost:5000` (see `vite.config.js`).

3. **Run the frontend**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```

4. **Visit the app**
   - [http://localhost:5173](http://localhost:5173)

---

## Docker (Backend)

```sh
docker build -t finalproject-backend ./backend
# Run with environment file
docker run -d -p 5000:5000 --env-file backend/.env finalproject-backend
```

---

## Log Rotation (Backend)
If deploying on Linux, add this to `/etc/logrotate.d/finalproject-backend`:
```
/path/to/your/project/backend/logs/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
    copytruncate
}
```

---

## Security Notes

- In production, restrict `/api/monitor` and `/api/docs` to admin users or internal IPs.
- Set `CLIENT_ORIGIN` in backend `.env` to your real frontend domain in production.
- Never commit `.env` files with secrets.

---

## Example `.env.example` for Backend

```
MONGO_URI=mongodb://localhost:27017/finalproject
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

---

## Example `.env.example` for Frontend

(Usually not needed unless you want to override Vite defaults, e.g. for API base URL.)

```
# Example: VITE_API_URL=http://localhost:5000/api
```

---

## License

MIT 