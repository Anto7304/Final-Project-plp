# Final Project Backend

## Overview
Express.js + MongoDB backend for blog, user, post, and comment management.

## Features
- JWT authentication
- Role-based access control
- Rate limiting & brute-force protection
- Input validation & sanitization
- Audit logging & monitoring
- Swagger API docs at `/api/docs`
- Real-time monitoring at `/api/monitor` (localhost only in production)
- Dockerized for easy deployment

## Setup

1. **Install dependencies**
   ```sh
   pnpm install
   # or
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env` and fill in your values.

3. **Run the server**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```

4. **API Docs**
   - Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## Docker

```sh
docker build -t finalproject-backend .
docker run -d -p 5000:5000 --env-file .env finalproject-backend
```

## Testing

- (Add instructions if/when you add automated tests)

## Log Rotation

If deploying on Linux, add this to `/etc/logrotate.d/finalproject-backend` (adjust the path as needed):

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

## Security Notes

- In production, restrict `/api/monitor` and `/api/docs` to admin users or internal IPs.
- Set `CLIENT_ORIGIN` to your real frontend domain in production.

## License

MIT 