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

if which pm2 > /dev/null
    then
        echo "You need to have pm2 installed, please install pm2 and rerun this script..."
        echo "You can install pm2 with npm install -g pm2"
    else
        echo "found pm2, skipping"
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
read -p 'backend url: ' bdomain
echo CDN_URL=$bdomain >> .env

echo Example: renzynx.space, do not include http or https
read -p 'frontend url: ' domain
echo DOMAIN=$domain >> .env
echo COOKIE_DOMAIN=.$domain >> .env

while true; do
read -p "Do you want to use https? (y/n) " yn
case $yn in
        [yY] ) echo SECURE=true >> .env

                break;;
        [nN] ) echo skipping;
                exit;;
esac
done

cd ../web

FILE=.env
if [ -f "$FILE" ]; then
    echo found .env
else
    echo ".env not found, creating .env file..."
    touch .env
fi

while true; do
read -p "Do you want to use https? (y/n) " yn
case $yn in
        [yY] ) echo USE_HTTPS=true >> .env
                break;;
        [nN] ) echo skipping;
                exit;;
esac
done


yarn install

cd ../server

yarn install && yarn build && yarn migrate && yarn setup && pm2 start "yarn start" -n backend

echo Installation finished.
echo One final step, because the files are hosted on the backend you need to go into web folder and manually update domains array with your backend url
echo You can learn more details here https://nextjs.org/docs/messages/next-image-unconfigured-host
echo After that you need to build the frontend with yarn build
echo And then you can start the frontend with pm2 start "yarn start" -n frontend