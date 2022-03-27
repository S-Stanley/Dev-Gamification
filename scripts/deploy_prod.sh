#!/bin/bash

location=$(pwd)

cd services/web || echo "error while trying to change directory to services/web"
npm i
npm run build
pm2 restart build

cd "$location" || echo "error while trying to get back to home repository"

cd services/api || echo "error while trying to change directory to services/api"
pip3 install -r requirements.txt
pm2 restart app

cd "$location" || echo "error while trying to get back to home repository"
