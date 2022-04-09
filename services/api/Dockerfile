FROM python:3.9.12

COPY . ./app
WORKDIR /app
RUN pip3 install -r requirements.txt

ARG TYPE_BUILD

CMD FLASK_ENV=development flask run --host=0.0.0.0 --port=1240