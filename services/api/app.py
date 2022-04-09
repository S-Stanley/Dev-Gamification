from flask import Flask, request, jsonify
from utils import gitlab
from flask_cors import CORS
import os
from crud.project import create_project
from crud.merges import create_merge, find_all_merges_by_project_id
from crud.data import add_stats
from crud.users import create_user
from crud.login import add_new_login
from crud.fetch_stats import insert_new_fetch_request, get_last_fetch_request

app = Flask(__name__)

CORS(app)

app.config['MONGO_URI'] = os.environ['db_link']

@app.route('/')
def welcome():
	return jsonify('API is running')

@app.route('/fetch', methods=["POST"])
def fetch_info():
	try:
		access_token = request.form.get("access_token")
		refresh_token = request.form.get("refresh_token")
		uri_gitlab = request.form.get("uri_gitlab")
		if not access_token or not refresh_token or not uri_gitlab:
			raise Exception("Access or refresh token is empty")
		user = gitlab.get_user_info(access_token, uri_gitlab)
		last_fetch = get_last_fetch_request(user['email'])
		insert_new_fetch_request(user['email'])
		all_projects = gitlab.get_all_project_by_user(access_token, uri_gitlab)
		all_merges = []
		for project in all_projects:
			all_merges += find_all_merges_by_project_id(project['id'])
			create_project(project)
		all_merges += gitlab.get_all_merge_request_by_project_id(access_token, all_projects, uri_gitlab, last_fetch)
		for merge in all_merges:
			create_merge(merge)
		ladder = gitlab.count_merges(all_merges)
		for player in ladder:
			add_stats(player['username'], player['merges'])
		create_user(user, {
			'access_token': access_token,
			'refresh_token': refresh_token,
		})
		add_new_login(user['email'])
		return jsonify(ladder)
	except Exception as e:
		print(e)
		return ("error while fetching data", 400)

if __name__ == "__main__":
	app.run(host="0.0.0.0", port="1240")