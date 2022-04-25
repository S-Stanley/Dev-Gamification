from heapq import merge
from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def find_merge(merge_id: str):
	try:
		print(merge_id)
		print(merge)
		to_find = mongo.merges.find_one({
			'id': merge_id,
		})
		if not to_find:
			return (False)
		return to_find
	except Exception as e:
		print(e)
		return True

def create_merge(merge):
	try:
		if find_merge(merge['id']):
			return
		mongo.merges.insert_one(merge)
	except Exception as e:
		print(e)

def find_all_merges_by_username(username: str):
	to_find = mongo.merges.find({
		'author.username': username,
	})
	output = []
	for i in to_find:
		output.append(i)
	return (output)

def find_all_merges_by_project_id(project_id: str):
	to_find = mongo.merges.find({
		'project_id': project_id,
	})
	output = []
	for i in to_find:
		output.append(i)
	return (output)