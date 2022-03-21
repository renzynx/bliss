# bliss

# Previews

![preview](https://cdn.upload.systems/uploads/w6wmT6C9.png)
![preview](https://cdn.upload.systems/uploads/QlwktzIN.png)
![preview](https://cdn.upload.systems/uploads/D6OVJIla.png)
![preview](https://cdn.upload.systems/uploads/a5lVk7sl.png)

# Install

```sh
git clone https://github.com/renzynx/bliss.git

cd bliss/server

cp .env.example .env

And fill out the credentials.

yarn install

yarn migrate

yarn build

yarn setup

And after this use pm2 to run it.

pm2 start "yarn start" -n backend
```

# Frontend stuff

```sh
cd ../web

cp .env.example .env

Fill out the backend domain.

yarn install

yarn build

pm2 start "yarn start" -n frontend
```

now you have a server to upload files (maybe) 💀

# Use this if you don't have a database

[https://railway.app](https://railway.app)

# Nginx SSL Setup

### This setup is performed on a ubuntu machine.

```sh
nano /etc/nginx/sites-available/backend
```

# Copy and paste the config below to it and save

# Remember to change the port to the port server or frontend running from

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

## Same thing with frontend

```sh
nano /etc/nginx/sites-available/frontend
```

```conf
    upstream frontend {
    server 127.0.0.1:5000;
    }

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
        proxy_pass http://frontend;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

# To setup ssl you need to have certbot installed on your system

## Install certbot

```sh
sudo apt install certbot python3-certbot-nginx
```

```sh
certbot --nginx -d api.backend.com
certbot --nginx -d frontend.com
```
