# Installing

This guide assumes you have a domain name and a server and have basic knowledge of how to use linux.

## Requirements

- `node` version 16.16.0 or higher
- `pm2` globally installed
- `yarn` globally installed
- `caddy` installed

### Backend Installation

Copy and paste the following into your terminal:

```bash
git clone https://github.com/renzynx/bliss.git

cd bliss/api

cp .env.example .env
```

Fill in the `.env` file with the appropriate values.

```bash
yarn install

yarn build

pm2 start "yarn start:prod" --name "bliss-api"
```

### Frontend Installation

Copy and paste the following into your terminal:

```bash
cd ../web

cp .env.example .env
```

Fill in the `.env` file with the appropriate values.

```bash
yarn install

yarn build

pm2 start "yarn start" --name "bliss-web"
```

### Domain name and SSL configuration

If you don't have caddy installed already
[Click Here](https://caddyserver.com/docs/install)

Copy and paste the following into your terminal:

You need to replace the placeholder with your actual domain name and port.

```bash
sudo caddy reverse-proxy --from https://yourdomain.com --to localhost:frontend-port
sudo caddy reverse-proxy --from https://api.yourdomain.com --to localhost:backend-port
```

Caddy will automatically generate a certificate for you.

### Screenshots

![preview](https://i.ibb.co/gJ7pC12/image.png)
![preview](https://i.ibb.co/5RvdxX6/image.png)
![preview](https://i.ibb.co/b2LzhGd/image.png)
![preview](https://i.ibb.co/84YP5pK/image.png)
![preview](https://i.ibb.co/DMdnrvX/image.png)
