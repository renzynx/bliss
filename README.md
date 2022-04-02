# bliss

A blazing fast sharex server.

# Installation

```sh
git clone -b server-only https://github.com/renzynx/bliss.git && cd bliss
```

```sh
yarn install
```

```sh
yarn build
```

```sh
cp .env.example .env
```

And fill out the credentials

Now migrate the database

```sh
yarn migrate
```

Now run setup to get your upload token

```sh
yarn setup
```

If you need to forgot your token you can find it with this command

```sh
yarn find
```

Or if you just to want to regenerate new token

```sh
yarn regen
```
