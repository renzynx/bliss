# Bliss

# Installation Guide

1. You need to have NodeJS 16 or higher installed.
2. Clone this repo git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss
3. Run `yarn install` or `npm install`.
4. Fill out the credentials by coping the `.env.example` to `.env`.
5. Run `yarn build:all` or `npm run build:all`.
6. Migrate the database with `yarn prisma migrate dev` or `yarn prisma db push` if you having some problem.
7. Generate a admin user with `node ./apps/api/prisma/seed.js` and in the end if you want to create a admin user type `y` or `Y`.
8. Run `yarn start:all` or `npm run start:all` to start Bliss.

# Nginx SSL Setup

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

Have a weird issue that you can't fix?
DM renzynx#7626 on Discord
