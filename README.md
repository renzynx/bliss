# What is Bliss?

Bliss is a file uploader service that aims to be easy to use and setup. It's designed for many people to use.

- You can make it run in public or private mode with an invitation-only system (or you can just disable the registration system completely).
- Out of the box support for ShareX with blazing fast speed.
- Web uploader with support for multiple files.
- Control Panel.

## Installation Guide

### Docker

<detail>
<summary>Expand for Docker/Docker Compose installation steps</summary>
<br>
1. Have docker and docker-compose installed (if you don't know what docker is [click here](https://docs.docker.com/)),
2. Clone this repo git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss
3. Run `cp .env.example .env` and fill out the credentials.
4. Run the command that corresponds to your OS:
<ul>
    <li>
        Linux: ./scripts/docker-linux.sh
    </li>
    <li>
        Window: ./scripts/docker-window.ps1
    </li>
    <li>
        These scripts are identical using the equivalent commands in each OS.
    </li>
</ul>
</detail>

<detail>
<summary>Expand for manual installation steps</summary>
<br>
1. You need to have NodeJS 16 or higher installed.
2. Clone this repo git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss
3. Run `yarn install` or `npm install`.
4. Fill out the credentials by coping the `.env.example` to `.env`.
5. Run `yarn build:all` or `npm run build:all`.
6. Migrate the database with `yarn prisma migrate deploy` or `yarn prisma db push` if you having some problem.
7. Run `yarn start:all` or `npm run start:all` to start Bliss.
</detail>

## Nginx SSL Setup

1. Create a nginx config for the backend `nano /etc/nginx/sites-available/backend`
2. Paste this in (you should change 42069 to your actual backend port and your domain to your desired domain)

```conf
upstream backend {
    server 127.0.0.1:42069;
}

server {
    listen 80;
    listen [::]:80;

    server_name your.domain.com

    client_max_body_size 100M;
    client_body_timeout 600s;

     location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://backend;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Create a nginx config for the frontend `nano /etc/nginx/sites-available/frontend`
4. Paste this in (you should change 6969 to your actual frontend port and your domain to your desired domain)

```conf
upstream frontend {
    server 127.0.0.1:6969;
}

server {
    listen 80;
    listen [::]:80;

    server_name your.domain.com

    client_max_body_size 100M;
    client_body_timeout 600s;

     location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://backend;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

5. Install certbot `sudo apt install certbot python3-certbot-nginx`.
6. Make a certificate for backend `certbot --nginx -d api.your.domain`
7. Make a certificate for frontend `certbot --nginx -d your.domain`

## File storage

Bliss support 2 types of storage: local storage or s3.

### Local storage

Files are stored directly in /uploads folder as a buffer.

### S3

Any S3 server is compatible.

## Contact

Have a weird issue that you can't fix?
DM renzynx#7626 on Discord
