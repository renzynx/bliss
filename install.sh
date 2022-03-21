#!/usr/bin/bash
command -v git >/dev/null 2>&1 ||
{ echo >&2 "Git is not installed. Installing..";
  apt install git
}

git clone https://github.com/renzynx/bliss.git

cd bliss/server

if which node > /dev/null
    then
        echo "node is installed, skipping..."
    else
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        source ~/.nvm/nvm.sh
        nvm install --lts
        npm install -g yarn
        yarn set version berry
    fi

if which pm2 >> /dev/null
    then
        echo "pm2 not found, installing..."
        npm install -g pm2
    else
        echo "found pm2"
    fi

FILE=.env
if [ -f "$FILE" ]; then
    echo found .env
else
    echo ".env not found, creating .env file..."
    touch .env
fi

read -p 'mysql url: ' mysql
echo MYSQL_URL=$mysql >> .env

read -p 'redis url: ' redis
echo REDIS_URL=$redis >> .env

read -p 'backend port: ' port
echo PORT=$port >> .env

echo This is use for signing cookie you can use a random generated hash or just type random character here
read -p 'session cookie: ' secret
echo SESSION_SECRET=$secret >> .env

echo Example: api.renzynx.space, do not include http or https
read -p 'frontend url: ' domain
echo DOMAIN=$domain >> .env
echo COOKIE_DOMAIN=.$domain >> .env

while true; do
read -p "Do you want to use https? (y/n) " yn
case $yn in
        [yY] ) echo SECURE=true >> .env;
                break;;
        [nN] ) echo skipping;
                exit;;
esac
done

yarn install && yarn build && yarn migrate && yarn setup

cd ../web

FILE=.env
if [ -f "$FILE" ]; then
    echo found .env
else
    echo ".env not found, creating .env file..."
    touch .env
fi

echo Example: https://api.renzynx.space include http or https this time
read -p 'your server domain: ' serverdomain
echo NEXT_PUBLIC_API_URL=$server >> .env

read -p 'the port you want your frontend running from: ' frontendport

yarn install && yarn build && pm2 start "yarn next start -p $frontendport" -n frontend

cd ../server

pm2 start "yarn start" -n backend

echo Installation finished.
echo One final step, because the files are hosted on the backend you need to go into web folder and manually update domains array with your backend url
echo You can learn more details here https://nextjs.org/docs/messages/next-image-unconfigured-host