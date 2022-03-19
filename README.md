# bliss

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
