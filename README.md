# Purpev

### Introduction

Welcome to purpev, an open source projet to add some gamifications.

The goal is to count the number of merges request, have a grade/rank and get somes reports.

You can have some data like this in gitlab or github, but they are mainly based on commit, not on merge/pull request.

### Scope

For the moment purpev is only working on gitlab.

### Structure of the repository

```services/``` crud for the database

```templates/``` html pages

```utils/``` OAuth2.0 connection to 3rd party like gitlab and get datas.

### Usage

If you don't have virtualenv installed
```shell
pip3 install virtualenv
```

Create the virtual env
```shell
virtualenv purpev_virtualenv
```

Activate the virtual env
```shell
source purpev_virtualenv/bin/activate
```

Install the requirements
```shell
pip3 install -r requirements.txt
```

Launch the server
```shell
bash script/start_purpev.sh
```

### Usefull commands

To desactivate the virutal environment run into your terminal:

```shell
deactivate
```

### Stack

- Flask
- Python
- MongoDB