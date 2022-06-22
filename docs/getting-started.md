# Getting Started

## Install Docker

 Make sure you have docker and docker-compose installed.

### Open docker
```bash
open -a docker
```

### Install docker

On GNU/Linux
```bash
apt-get install docker
```

On MacOS
```bash
brew install docker
```

Open docker socket
```
open -a docker
```

## Create the volume for postgres

```bash
docker volume create purpev_postgres_volume
```

## Run all services on local

```bash
bash scripts/start-dev.sh
```

## Run all services on production

```bash
bash scripts/start-prod.sh
```

## Ressources

1. [Setting up docker on linux](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-fr)
1. [Setting up docker on MacOS](https://pilsniak.com/how-to-install-docker-on-mac-os-using-brew)