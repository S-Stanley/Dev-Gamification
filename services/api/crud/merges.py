from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link']).dev

def find_merge(merge_id: str):
	to_find = mongo.merges.find_one({
		'id': merge_id,
	})
	return to_find

def create_merge(merge):
	if find_merge(merge['id']): return
	mongo.merges.insert_one(merge)