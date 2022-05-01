
from crypt import methods
from os import abort
from flask import Blueprint, request, jsonify, abort
from ..database.functions.repo import create_new_repo, find_all_repo_by_user_id
from ..database.functions.users import find_user_by_email, find_user_by_id

repo = Blueprint('repo', __name__)

@repo.route('/', methods=['POST'])
def create_repo():
    try:
        user_id = request.form.get('user_id')
        personal_token = request.form.get('personal_token')
        uri = request.form.get('uri')
        basic_auth = request.form.get('basic_auth')
        if not user_id:
            print('Missing parameter email')
            abort(400)
        if not personal_token:
            print('Missing parameter personal_token')
            abort(400)
        if not uri:
            print('Missing parameter uri')
            abort(400)
        if not basic_auth:
            basic_auth = ''
        usr = find_user_by_id(user_id)
        if not usr:
            print('Cannot find user')
            abort(400)
        repo_created = create_new_repo(str(usr['_id']), personal_token, uri, basic_auth)
        if not repo_created:
            print('Cannot create new repository')
            abort(400)
        all_repo_user = find_all_repo_by_user_id(str(usr['_id']))
        return (jsonify(all_repo_user))
    except Exception as e:
        print(e)
        abort(400)

@repo.route('/<user_id>')
def get_all_repo_by_users_id(user_id: str):
    try:
        usr = find_user_by_id(user_id)
        if not usr:
            print('Cannot find user {}'.format(user_id))
            abort(400)
        all_repo_user = find_all_repo_by_user_id(str(usr['_id']))
        return (jsonify(all_repo_user))
    except Exception as e:
        print(e)
        abort(400)