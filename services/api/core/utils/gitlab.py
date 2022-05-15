from dotenv import load_dotenv
from flask_pymongo import MongoClient
import os, requests, json
from tqdm import tqdm

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

load_dotenv()

def find_author_or_create(arr, item):
	for tmp in arr:
		if tmp['username'] == item['author']['username']:
			tmp['merges'].append(item)
			return
	arr.append({
		'username': item['author']['username'],
		'merges': [item]
	})
	return (arr)

def sort_by_merges_number(e):
	return e['merges']

def sort_by_weight_total(e):
	return e['weight']

def get_grad(nb_merge):
	with open('grad.json', 'r') as f:
		all_grades = json.loads(f.read())
	for grade in all_grades:
		if int(grade['number']) <= nb_merge:
			previous = grade['name']
			continue
		else:
			return previous

def get_level(nb_merge: int):
	with open('grad.json', 'r') as f:
		all_grades = json.loads(f.read())
	for grade in all_grades:
		if int(grade['number']) <= nb_merge:
			previous = grade['level']
			continue
		else:
			return previous

def count_weight_by_username(username: str):
	to_find = mongo.weight.find({
		'username': username
	})
	total = 0
	output = []
	for i in to_find:
		if i['weight_to_add']:
			total += int(i['weight_to_add'])
	return (total)

def count_merges(data, sorted_by: str):
	output = []
	for merge in tqdm(data):
		if 'state' in merge and merge['state'] == 'merged':
			find_author_or_create(output, merge)
	to_return = []
	for i in output:
		to_return.append({
			'username': i['username'],
			'merges': len(i['merges']),
			'grade': get_grad(len(i['merges'])),
			'level': get_level(len(i['merges'])),
			'weight': count_weight_by_username(i['username']),
		})
	if not sorted_by:
		to_return.sort(reverse=True, key=sort_by_merges_number)
	elif sorted_by == 'weight':
		to_return.sort(reverse=True, key=sort_by_weight_total)
	else:
		to_return.sort(reverse=True, key=sort_by_merges_number)
	return to_return

def get_all_merge_request_by_project_id(access_token, projects, uri_gitlab, last_fetch, basic_auth):
	output = []
	for project in projects:
		items_get = 100
		page = 0
		while items_get == 100:
			page += 1
			if (last_fetch):
				url = '{}/api/v4/projects/{}/merge_requests/?access_token={}&per_page=100&page={}&created_after={}&state=merged'.format(uri_gitlab, project['id'], access_token, page, last_fetch)
			else:
				url = '{}/api/v4/projects/{}/merge_requests/?access_token={}&per_page=100&page={}&state=merged'.format(uri_gitlab, project['id'], access_token, page)
			if basic_auth:
				req = requests.get(url, headers={
					'authorization': f'Basic {basic_auth}'
				})
			else:
				req = requests.get(url)
			items_get = len(req.json())
			if req.status_code == 200:
				for i in req.json():
					output.append(dict(i))
	return output


def get_user_info(access_token, uri_gitlab, basic_auth):
	url = '{}/api/v4/user?access_token={}'.format(uri_gitlab, access_token)
	if basic_auth:
		req = requests.get(url, headers={
			'authorization': f'Basic {basic_auth}'
		})
	else:
		req = requests.get(url)
	return (req.json())

def get_all_project_by_user(access_token, uri_gitlab, basic_auth):
	per_page = 20
	page = 0
	project_download = 20
	output = []
	while project_download == 20:
		url = '{}/api/v4/projects?membership=true&access_token={}&page={}&per_page={}'.format(uri_gitlab, access_token, page, per_page)
		if basic_auth:
			req = requests.get(url, headers={
				'authorization': f'Basic {basic_auth}'
			})
		else:
			req = requests.get(url)
		for project in req.json():
			output.append(project)
		project_download = len(req.json())
		page += 1
	return output

def get_auth_uri():
	url = 'https://gitlab.com/oauth/authorize?client_id={}&redirect_uri={}&response_type=code&state={}&scope={}'.format(
		os.environ['client_id'],
		os.environ['redirect_uri'],
		os.environ['state'],
		os.environ['scope'],
	)
	return url

def get_token(code):
	data = {
		'client_id': os.environ['client_id'],
		'code' : code,
		'grant_type': 'authorization_code',
		'redirect_uri': os.environ['redirect_uri'],
		'client_secret': os.environ['client_secret'],
	}
	url = f'https://gitlab.com/oauth/token'
	req = requests.post(url, data)
	return req.json()
