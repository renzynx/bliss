# What is Bliss?

Bliss is a file uploader service that aims to be easy to use and setup. It's designed for many people to use.

- You can make it run in public or private mode with an invitation-only system (or you can just disable the registration system completely).
- Out of the box support for ShareX with blazing fast speed.
- Web uploader with support for multiple files.
- Control Panel.

## Installation Guide

### Docker

<details>
<summary>Expand for Docker/Docker Compose installation steps</summary>
<br>
1. Have docker and docker-compose installed (if you don't know what docker is <a href="https://docs.docker.com/">click here</a>.
<br>
2. Clone this repo <code>git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss</code>
<br>
3. Run <code>cp .env.example .env</code> and fill out the credentials.
<br>
4. Run the command that corresponds to your OS:
<br>
<ul>
    <li>
        Linux: <code>./scripts/docker-linux.sh</code>
    </li>
    <li>
        Window: <code>./scripts/docker-window.ps1</code>
    </li>
    <li>
        These scripts are identical using the equivalent commands in each OS.
    </li>
</ul>
</details>

### Manual

<details>
<summary>Expand for manual installation steps</summary>
<br>
1. You need to have NodeJS 16 or higher installed.
<br>
2. Clone this repo <code>git clone -b dev --recursive https://github.com/renzynx/bliss.git && cd bliss</code>.
<br>
3. Run <code>yarn install</code> or <code>npm install</code>.
<br>
4. Run <code>cp .env.example .env</code> and fill out the credentials.
<br>
5. Run <code>yarn build:all</code> or <code>npm run build:all</code>.
<br>
6. Migrate the database with <code>yarn prisma migrate deploy</code> or <code>yarn prisma db push</code> if you having some problem.
<br>
7. Run <code>yarn start:all</code> or <code>npm run start:all</code> to start Bliss.
</details>

## Nginx SSL Setup

[Click Here](docs/nginx.md)

## Contact

Have a weird issue that you can't fix?
DM renzynx#7626 on Discord
