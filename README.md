# bliss

# Get Started

```sh
git clone https://github.com/renzynx/bliss.git .

cd server

cp .env.example .env

And fill out the credentials.

yarn install

yarn migrate

yarn build

yarn setup

And after this use pm2 to run it.

pm2 start "yarn start:prod" -n backend
```

# Frontend stuff

```sh
cd web

yarn install

yarn build

pm2 start "yarn start" -n frontend
```

now you have a server to upload files (maybe) 💀
