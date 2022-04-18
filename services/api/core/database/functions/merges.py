from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def find_merge(merge_id: str):
	to_find = mongo.merges.find_one({
		'id': merge_id,
	})
	return to_find

def create_merge(merge):
	if find_merge(merge['id']): return
	mongo.merges.insert_one(merge)

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