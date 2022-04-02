# Previews

![preview](https://cdn.upload.systems/uploads/w6wmT6C9.png)
![preview](https://cdn.upload.systems/uploads/QlwktzIN.png)
![preview](https://cdn.upload.systems/uploads/D6OVJIla.png)
![preview](https://cdn.upload.systems/uploads/a5lVk7sl.png)

# Install Guide

```sh
git clone https://github.com/renzynx/bliss.git && cd bliss/server
```

```sh
yarn install
```

```sh
cp .env.example .env
```

The .env should look like this

```shell
MYSQL_URL="example: mysql://user:password@host:port/database"

REDIS_URL="example: redis://user:password@host:port"

this can be anything you want
SESSION_SECRET="secret key for signing cookies: keyboard cat"

for cors stuff, your frontend url do not include https or http here, example: www.your-host.com, DO NOT include http:// or https://
DOMAIN=""

this should be your server url, example: api.your-host.com, DO NOT include http:// or https://
CDN_URL=""

Set to true if you use https
SECURE="false"

The port you wanted your server to start on
PORT=
```

Next we need to compile typescript to javascript and migrate the database

```sh
yarn build
```

```sh
yarn migrate
```

Now you need to run the setup and create the first admin user

```sh
yarn setup
```

And now we should ready to start the server. You can use pm2 to get the server to run in the background.
If you don't have pm2 installed

```sh
npm install -g pm2
```

We can start the server with this command

```sh
pm2 start "yarn start" -n bliss-backend
```

We need to change directory to the frontend folder.

```sh
cd ../web
```

We also need to fill out the .env here

```sh
cp .env.example .env
```

The .env should look like this

```shell
This time you need to include https:// or http:// at the start of the url.
Example: https://api.renzynx.space
NEXT_PUBLIC_API_URL=""
```

Now we compile typescript to javascript

```sh
yarn build
```

And start the frontend
Nextjs default start at port 3000, but you can use this command to use whatever port you want

```sh
pm2 start "yarn next start -p PORTHERE" -n bliss-frontend
```

# Important step

You must enter your backend domain in next.config.js or its not gonna work
You can get more details about that here: https://nextjs.org/docs/messages/next-image-unconfigured-host

# Nginx SSL Setup

This setup is performed on a ubuntu machine.

```sh
nano /etc/nginx/sites-available/backend
```

Copy and paste the config below to it and save

Remember to change the port to the port server or frontend running from

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

```sh
nano /etc/nginx/sites-available/frontend
```

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

To setup ssl you need to have certbot installed on your system

## Install certbot

```sh
sudo apt install certbot python3-certbot-nginx
```

```sh
certbot --nginx -d api.foo.bar
certbot --nginx -d foo.bar
```
