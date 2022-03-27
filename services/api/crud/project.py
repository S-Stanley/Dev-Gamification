from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link']).dev

def find_project(project_id: str):
	to_find = mongo.projects.find_one({
		'id': project_id,
	})
	return to_find

def create_project(project):
	if find_project(project['id']): return
	mongo.projects.insert_one(project)