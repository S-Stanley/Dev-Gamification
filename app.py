from flask import Flask, redirect, request, jsonify, render_template
from utils import gitlab
from flask_pymongo import PyMongo
import os, datetime
from services.project import create_project, find_project
from services.merges import create_merge, find_merge
from services.data import add_stats
from services.users import find_user_by_email, create_user
from services.login import add_new_login

app = Flask(__name__)

app.config['MONGO_URI'] = os.environ['db_link']

@app.route('/redirect')
def hello_word():
	code = request.args.get('code')
	info_token = gitlab.get_token(code)
	'''
	To store in database:
		- info_token.access_token
		- info_token.refresh_token
	'''
	user = gitlab.get_user_info(info_token['access_token'])
	print(user)
	all_projects = gitlab.get_all_project_by_user(info_token['access_token'])
	print(len(all_projects))
	if len(all_projects) > 0:
		print(all_projects[0])
	for project in all_projects:
		create_project(project)
	all_merges = gitlab.get_all_merge_request_by_project_id(info_token['access_token'], all_projects)
	print(len(all_merges))
	if len(all_merges) > 0:
		print(all_merges[0])
	for merge in all_merges:
		create_merge(merge)
	ladder = gitlab.count_merges(all_merges)
	for player in ladder:
		add_stats(player['username'], player['merges'])
	create_user(user, info_token)
	add_new_login(user['email'])
	return render_template('hello.html', ladder=ladder)
	# return jsonify(ladder)

@app.route('/')
def get_auth_link():
	return redirect(gitlab.get_auth_uri())