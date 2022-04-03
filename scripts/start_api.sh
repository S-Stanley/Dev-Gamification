#!/bin/bash

cd services/api || echo "error while trying to change directory to /services/api"
FLASK_ENV=development flask run --host=0.0.0.0 --port=1240