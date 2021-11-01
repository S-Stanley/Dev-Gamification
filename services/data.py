from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link']).dev

def add_stats(username: str, count: int):
	mongo.data.insert_one({
		'username': username,
		'total': count,
	})