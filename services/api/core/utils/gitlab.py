from heapq import merge
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

def sort_by_average_weight(e):
	return e['average_weight']

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

def find_issue_related_mr(merge_id: str):
	issue_related_mr = mongo.issues_related_mr.find_one({
		"merge_id": merge_id,
	})
	if issue_related_mr:
		issue = mongo.issues.find_one({
			'id': issue_related_mr['issue_id']
		})
		if issue and issue['weight']:
			return (issue['weight'])
	return (0)

def count_weight_by_username(all_merges_users: str):
	total_weight = 0
	total_mr_weighted = 0
	for merge in all_merges_users:
		res = find_issue_related_mr(merge['id'])
		if res != 0:
			total_mr_weighted += 1
		total_weight += res
	if (total_mr_weighted == 0):
		average_weight =  0
	else:
		average_weight =  (total_weight / total_mr_weighted)
	return (total_weight, average_weight)

def get_all_authors_from_all_merges(all_merges):
	authors = []
	for merge in all_merges:
		if merge['author']['username'] not in authors:
			authors.append(merge['author']['username'])
	return (authors)

def get_all_merge_by_author(username: str, all_merges, month: str, year: str):
	output = []
	for merge in all_merges:
		if merge['author']['username'] == username and merge['state'] == 'merged':
			if month == 'ALL':
				output.append(merge)
			else:
				if int(merge['merged_at'].split('-')[1]) == int(month) and int(merge['merged_at'].split('-')[0]) == int(year):
					output.append(merge)
	return (output)

def count_merges(data, sorted_by: str, month: str, year: str):
	authors = get_all_authors_from_all_merges(data)
	to_return = []
	for username in authors:
		all_merge_by_author = get_all_merge_by_author(username, data, month, year)
		total_weight, average_weight = count_weight_by_username(all_merge_by_author)
		to_return.append({
			'username': username,
			'merges': len(all_merge_by_author),
			'grade': get_grad(len(all_merge_by_author)),
			'level': get_level(len(all_merge_by_author)),
			'weight': total_weight,
			'average_weight': round(average_weight, 2),
		})
	if not sorted_by:
		to_return.sort(reverse=True, key=sort_by_merges_number)
	elif sorted_by == 'weight':
		to_return.sort(reverse=True, key=sort_by_weight_total)
	elif sorted_by == 'average_weight':
		to_return.sort(reverse=True, key=sort_by_average_weight)
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
