from flask_pymongo import MongoClient
import os, datetime

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def add_new_login(email: str) -> None:
	new_login = mongo.login.insert_one({
		'email': email,
		'creation_date': str(datetime.datetime.now())
	})
	if not new_login:
		return (False)
	return (True)