# Purpev

### Introduction

Welcome to purpev, an open source projet to add some gamifications.

The goal is to count the number of merges request, have a grade/rank and get somes reports.

You can have some data like this in gitlab or github, but they are mainly based on commit, not on merge/pull request.

You can access the production version at [purpev.com](https://purpev.com)

### Scope

For the moment purpev is only working on gitlab.

### Structure of the repository

```scripts/``` every bash repo related scripts

```services/``` all the differents services (backend, frontend, etc..)

### Usage

```shell
bash scripts/start_webapp.sh # to run the front end server
```

```shell
bash scripts/start_api.sh to # run the back end server
```

You will need somes environments variables, ask the owner.

### Stack

- Flask
- Python3
- MongoDB
- React
- Typescript
