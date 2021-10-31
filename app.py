from flask import Flask, redirect, request, jsonify
from utils import gitlab
from flask_pymongo import PyMongo
import os, datetime

app = Flask(__name__)

app.config['MONGO_URI'] = os.environ['db_link']
mongo = PyMongo(app)

def add_stats(username: str, count: int):
	mongo.db.data.insert_one({
		'username': username,
		'total': count,
	})

def find_merge(merge_id: str):
	print(merge_id)
	to_find = mongo.db.merges.find_one({
		'id': merge_id,
	})
	print(to_find)
	return to_find

def find_project(project_id: str):
	to_find = mongo.db.projects.find_one({
		'id': project_id,
	})
	return to_find

def find_user_by_email(email: str):
	to_find = mongo.db.users.find_one({
		'email': email
	})
	return to_find

def create_user(usr, auth):
	if find_user_by_email(usr['email']): return
	mongo.db.users.insert_one({
		'name': usr['name'],
		'username': usr['username'],
		'avatar_url': usr['avatar_url'],
		'web_url': usr['web_url'],
		'email': usr['email'],
		'refresh_token': auth['refresh_token'],
		'access_token': auth['access_token'],
		'created_at': str(datetime.datetime.now())
	})

def create_merge(merge):
	if find_merge(merge['id']): return
	mongo.db.merges.insert_one(merge)

def create_project(project):
	if find_project(project['id']): return
	mongo.db.projects.insert_one(project)


@app.route('/')
def hello_word():
	code = request.args.get('code')
	info_token = gitlab.get_token(code)
	'''
	To store in database:
		- info_token.access_token
		- info_token.refresh_token
	'''
	all_projects = gitlab.get_all_project_by_user(info_token['access_token'])
	for project in all_projects:
		create_project(project)
	all_merges = gitlab.get_all_merge_request_by_project_id(info_token['access_token'])
	for merge in all_merges:
		create_merge(merge)
	ladder = gitlab.count_merges()
	for player in ladder:
		add_stats(player['username'], player['merges'])
	create_user(gitlab.get_user_info(info_token['access_token']), info_token)
	return jsonify(ladder)

@app.route('/link')
def get_auth_link():
	return redirect(gitlab.get_auth_uri())