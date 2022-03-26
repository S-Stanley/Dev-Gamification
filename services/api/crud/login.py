from flask_pymongo import MongoClient
import os, datetime

mongo = MongoClient(os.environ['db_link']).dev

def add_new_login(email: str) -> None:
	mongo.login.insert_one({
		'email': email,
		'creation_date': str(datetime.datetime.now())
	})