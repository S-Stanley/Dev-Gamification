from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def find_repo_by_uri_and_user_id(uri: str, user_id: str):
	try:
		to_find = mongo.repo.find_one({
			'user_id': user_id,
			'uri': uri,
		})
		if not to_find:
			return (False)
		return (to_find)
	except Exception as e:
		print(e)
		return (False)

def create_new_repo(user_id: str, personal_token: str, uri: str, basic_auth: str = '') -> bool:
	try:
		existing_repo = find_repo_by_uri_and_user_id(uri, user_id)
		if not existing_repo:
			create = mongo.repo.insert_one({
				'user_id': user_id,
				'personal_token': personal_token,
				'uri': uri,
				'basic_auth': basic_auth,
			})
			if not create:
				raise Exception(f'Cannot create repo for user_id {user_id}')
		return (True)
	except Exception as e:
		print(e)
		return (False)

def find_all_repo_by_user_id(user_id: str):
	try:
		to_find = mongo.repo.find({
			'user_id': user_id
		})
		output = []
		for repo in to_find:
			repo['_id'] = str(repo['_id'])
			del repo['personal_token']
			del repo['basic_auth']
			output.append(repo)
		return (output)
	except Exception as e:
		print(e)
		return (False)