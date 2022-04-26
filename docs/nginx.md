## Nginx SSL Setup

You need to make sure that

- `backend` and `frontend` port matched your config.
- Replace `your.domain` to your actual domain.

```nginx
upstream backend {
    server 127.0.0.1:3333;
}

server {
    listen 80;
    listen [::]:80;

    server_name api.your.domain;

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

```nginx
upstream frontend {
    server 127.0.0.1:4200;
}

server {
    listen 80;
    listen [::]:80;

    server_name your.domain;

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

}
```

### Making certificate with certbot

1. Install certbot `sudo apt install certbot python3-certbot-nginx`
2. Issue a new certificate for backend `sudo certbot --nginx -d api.your.domain`
3. Issue a new certificate for frontend `sudo certbot --nginx -d your.domain`
