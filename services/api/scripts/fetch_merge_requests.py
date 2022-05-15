import requests, os
from flask_pymongo import MongoClient
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv()

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def fetch_repo() -> list:
	all_repo = mongo.repo.find()
	return (all_repo)

def fetch_merge_requests_by_project_users(repo, project_id) -> list:
	output = []
	items_get = 100
	page = 0
	while items_get == 100:
		page += 1
		url = '{}/api/v4/projects/{}/merge_requests/?access_token={}&per_page=100&page={}&state=merged'.format(repo['uri'], project_id, repo['personal_token'], page)
		if repo['basic_auth']:
			req = requests.get(url, headers={
				'authorization': 'Basic {}'.format(repo['basic_auth'])
			})
		else:
			req = requests.get(url)
		items_get = len(req.json())
		if req.status_code == 200:
			for i in req.json():
				output.append(dict(i))
	return output

def get_all_projects_by_users(repo) -> list:
	per_page = 20
	page = 0
	project_download = 20
	output = []
	while project_download == 20:
		url = '{}/api/v4/projects?membership=true&access_token={}&page={}&per_page={}'.format(repo['uri'], repo['personal_token'], page, per_page)
		if repo['basic_auth']:
			req = requests.get(url, headers={
				'authorization': 'Basic {}'.format(repo['basic_auth'])
			})
		else:
			req = requests.get(url)
		for project in req.json():
			output.append(project)
		project_download = len(req.json())
		page += 1
	return output

def find_merge(merge_id: str):
	try:
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

def find_project_user(project_id, user_id, repo_id):
    to_find = mongo.project_user.find_one({
        'user_id': user_id,
        'project_id': project_id,
		'repo_id': repo_id,
    })
    return (to_find)

def create_project_user(project_id, user_id, repo_id) -> None:
    if find_project_user(project_id, user_id, repo_id):
        return
    mongo.project_user.insert_one({
        'project_id': project_id,
        'user_id': user_id,
		'repo_id': repo_id,
    })

def find_project(project_id: str):
	to_find = mongo.projects.find_one({
		'id': project_id,
	})
	return to_find

def create_project(project):
	if find_project(project['id']): return
	mongo.projects.insert_one(project)

def get_all_projects_by_user_id(user_id: str):
	data = mongo.project_user.find({
		'user_id': user_id
	})
	return (data)

all_repo = fetch_repo()
for repo in all_repo:
	projects = get_all_projects_by_users(repo)
	for project in projects:
		create_project(project)
		create_project_user(project['id'], repo['user_id'], str(repo['_id']))
	all_projects_users = get_all_projects_by_user_id(repo['user_id'])
	for project_user in all_projects_users:
		all_merges = fetch_merge_requests_by_project_users(repo, project_user['project_id'])
		for merges in all_merges:
			create_merge(merges)
