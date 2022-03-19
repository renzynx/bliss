# bliss

# Warning

Please remove all the comments inside .env or it won't work because im an idiot ☠

# Get Started

```sh
git clone https://github.com/renzynx/bliss.git

cd bliss/server

cp .env.example .env

And fill out the credentials.

yarn install

yarn migrate

yarn build

yarn setup

Remember to save the generated password somewhere so you can login later.

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

```sh
nano /etc/nginx/sites-available/backend
nano /etc/nginx/sites-available/frontend
```

# Copy and paste the config below to it and save

# Remember to change the port to the port server or frontend running from

```conf
server {
    listen 80;

    server_name your.domain.com

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# To setup ssl you need to have certbot installed on your system

```sh
certbot --nginx -d your.domain.com
```
