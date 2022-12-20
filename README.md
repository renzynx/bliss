# Installing

This guide assumes you have a domain name and a server and have basic knowledge of how to use linux.

<details>
<summary>Expand for docker installation steps</summary>

## Requirements

- `docker` and `docker compose` installed

Copy and paste the following into your terminal:

```bash
git clone https://github.com/renzynx/bliss.git

cd bliss

cp docker-compose.example.yml docker-compose.yml
```

Fill in the `docker-compose.yml` environment with the appropriate values.

```bash
docker compose up -d
```

To get the initial root account, run the following command:

```bash
docker exec api cat /app/initial_root_password.txt
```

Now you can login with the root account with owner permissions.

### Updating

To update the application, run the following command:

```bash
docker compose pull && docker compose up -d
```

</details>

<details>
<summary>Expand for manual installation steps</summary>

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

yarn prisma migrate deploy

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

### Updating

To update the application, run the following command:

```bash
git pull
```

Then go through the installation steps again.

</details>

<br>

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

<br>

### Screenshots

<p align="center">
  <img src="https://cdn.amog-us.club/brave_0yeRi3yz70.png" alt="image" border="0">
  <img src="https://cdn.amog-us.club/brave_PXux828NtJ.png" alt="image" border="0">
  <img src="https://cdn.amog-us.club/brave_fcyvLlO3eQ.png" alt="image" border="0">
  <img src="https://cdn.amog-us.club/brave_bvZwFE2XPr.png" alt="image" border="0">
  <img src="https://cdn.amog-us.club/brave_F2n7sQsia2.png" alt="image" border="0">
</p>
