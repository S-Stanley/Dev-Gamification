from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def add_stats(username: str, count: int):
	mongo.data.insert_one({
		'username': username,
		'total': count,
	})