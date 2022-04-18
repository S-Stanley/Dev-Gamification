from flask_pymongo import MongoClient
import os, datetime

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def find_user_by_email(email: str):
	to_find = mongo.users.find_one({
		'email': email
	})
	return to_find

def create_user(usr, auth):
	if find_user_by_email(usr['email']): return
	mongo.users.insert_one({
		'name': usr['name'],
		'username': usr['username'],
		'avatar_url': usr['avatar_url'],
		'web_url': usr['web_url'],
		'email': usr['email'],
		'refresh_token': auth['refresh_token'],
		'access_token': auth['access_token'],
		'created_at': str(datetime.datetime.now())
	})