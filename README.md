# What is Bliss?

Bliss is a file uploader service that aims to be easy to use and setup. It's designed for many people to use.

- You can make it run in public or private mode with an invitation-only system (or you can just disable the registration system completely).
- Out of the box support for ShareX with blazing fast speed.
- Web uploader with support for multiple files.
- Control Panel.

## Installation Guide

### Docker

<details>
<summary>Expand for Docker/Docker Compose installation steps</summary>
<br>
1. Have docker and docker-compose installed (if you don't know what docker is [click here](https://docs.docker.com/)).
<br>
2. Clone this repo git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss
<br>
3. Run <code>cp .env.example .env</code> and fill out the credentials.
<br>
4. Run the command that corresponds to your OS:
<ul>
    <li>
        Linux: <code>./scripts/docker-linux.sh
    </li>
    <li>
        Window: ./scripts/docker-window.ps1
    </li>
    <li>
        These scripts are identical using the equivalent commands in each OS.
    </li>
</ul>
</details>

### Manual

<details>
<summary>Expand for manual installation steps</summary>
<br>
1. You need to have NodeJS 16 or higher installed.
<br>
2. Clone this repo <code>git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss</code>.
<br>
3. Run <code>yarn install</code> or <code>npm install</code>.
<br>
4. Run <code>cp .env.example .env</code> and fill out the credentials.
<br>
5. Run <code>yarn build:all</code> or <code>npm run build:all</code>.
<br>
6. Migrate the database with <code>yarn prisma migrate deploy</code> or <code>yarn prisma db push</code> if you having some problem.
<br>
7. Run <code>yarn start:all</code> or <code>npm run start:all</code> to start Bliss.
</details>

## Nginx SSL Setup

You need to use a separate domain name for frontend and backend.
Eg: Frontend: cdn.renzynx.space, Backend: uploads.renzynx.space

1. Create a nginx config for the backend `nano /etc/nginx/sites-available/backend`
2. Paste this in (you should change 42069 to your actual backend port and your domain to your desired domain)
<details>
    <summary>
        Expand for backend nginx config.
    </summary>
    <br>
<code>
upstream backend {
    server 127.0.0.1:3333;
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
</code>

</details>
3. Create a nginx config for the frontend `nano /etc/nginx/sites-available/frontend`
4. Paste this in (you should change 6969 to your actual frontend port and your domain to your desired domain)
<details>
    <summary>
        Expand for frontend nginx config.
    </summary>
<br>
<code>
upstream frontend {
    server 127.0.0.1:4200;
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
</code>

</details>
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
