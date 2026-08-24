# Cloudify client

The React client persists the JWT returned at login and sends it as an `Authorization: Bearer` header for uploads, listings, and downloads. Expired sessions return the user to the login screen.

## Configure and run

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL` to the public API origin, for example `https://api.example.com`. It must not include a trailing `/api` unless the server is configured behind that prefix.

For a Docker build, pass the same value at build time:

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t cloudify-client .
```
