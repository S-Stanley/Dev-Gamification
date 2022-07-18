import requests, os, time
from flask_pymongo import MongoClient
from tqdm import tqdm
from dotenv import load_dotenv

load_dotenv()
mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def fetch_repo() -> list:
	all_repo = mongo.repo.find()
	output = []
	for i in all_repo:
		output.append(i)
	return (output)

def fetch_merge_requests_by_project_users(repo, project_id) -> list:
	output = []
	items_get = 100
	page = 0
	while items_get == 100:
		page += 1
		time.sleep(2)
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
		time.sleep(2)
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
	output = []
	for i in data:
		output.append(i)
	return (output)

def find_issue(issue_id: str):
	to_find = mongo.issues.find_one({
		'id': issue_id,
	})
	return to_find

def save_issue_merge_request(issue):
	if find_issue(issue['id']): return
	mongo.issues.insert_one(issue)

def find_weigh_merge_request_by_username(username: str, issue_id: str):
	to_find = mongo.weight.find_one({
		'username': username,
		'issue_id': issue_id,
	})
	if to_find:
		return to_find
	return (False)

def save_weigh_merge_request_by_username(
	username: str,
	repo_id: str,
	project_user_id: str,
	uri: str,
	weight_to_add: str,
	issue_id: str,
):
	if find_weigh_merge_request_by_username(username, issue_id): return
	else:
		mongo.weight.insert_one({
			'username': username,
			'repo_id': repo_id,
			'project_user_id': project_user_id,
			'uri': uri,
			'weight_to_add': weight_to_add,
			'issue_id': issue_id,
	})

def find_issue_by_id(issues_id):
	to_find = mongo.issues.find_one({
		'id': issues_id,
	})
	if to_find:
		return (to_find)
	return (False)


def save_issue(issue):
	if find_issue_by_id(issue['id']): return
	mongo.issues.insert_one(issue)

def find_issue_related_mr(issues_id, merge_id):
	to_find = mongo.issues_related_mr.find_one({
		"issue_id": issues_id,
		"merge_id": merge_id
	})
	if to_find:
		return (to_find)
	return (False)

def save_issue_related_mr(issues_id, merge_id):
	if find_issue_related_mr(issues_id, merge_id): return
	mongo.issues_related_mr.insert_one({
		"issue_id": issues_id,
		"merge_id": merge_id
	})

def fetch_issues_that_close_merge_request(merge, repo, project_id):
		time.sleep(2)
		url = '{}/api/v4/projects/{}/merge_requests/{}/closes_issues?membership=true&access_token={}'.format(repo['uri'], project_id, merge['iid'], repo['personal_token'])
		if repo['basic_auth']:
			req = requests.get(url, headers={
				'authorization': 'Basic {}'.format(repo['basic_auth'])
			})
		else:
			req = requests.get(url)
		if (req.status_code == 200) and len(req.json()) > 0:
			issue = req.json()[0]
			save_issue(issue)
			save_issue_related_mr(issue['id'], merge['id'])
		return (req.json())

def find_all_project_user_by_repo_id(repo_id: str):
    to_find = mongo.project_user.find({
        'repo_id': repo_id,
    })
    output = []
    for i in to_find:
        i['_id'] = str(i['_id'])
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

all_repo = fetch_repo()
print('Running first loop')
print(f'{len(all_repo)} to Fetch')
for repo in all_repo:
	print('Fetching data for repo:', repo["uri"])
	projects = get_all_projects_by_users(repo)
	print(f'{len(projects)} to fetch for repo {repo["uri"]}')
	for project in projects:
		create_project(project)
		create_project_user(project['id'], repo['user_id'], str(repo['_id']))
	all_projects_users = get_all_projects_by_user_id(repo['user_id'])
	print(f'{len(all_projects_users)} to fetch for repo {repo["uri"]}')
	for project_user in tqdm(all_projects_users):
		all_merges = fetch_merge_requests_by_project_users(repo, project_user['project_id'])
		for merges in all_merges:
			create_merge(merges)

print('Running second loop')
all_repo = fetch_repo()
for repo in all_repo:
	all_project_users = find_all_project_user_by_repo_id(str(repo['_id']))
	for project_user in tqdm(all_project_users):
		all_merges = find_all_merges_by_project_id(project_user['project_id'])
		for merge in tqdm(all_merges):
				fetch_issues_that_close_merge_request(merge, repo, project_user['project_id'])
