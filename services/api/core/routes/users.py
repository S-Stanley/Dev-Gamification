import json
from flask import Blueprint, request, jsonify, abort
from ..database.functions.users import find_user_by_email, create_user
from ..database.functions.login import add_new_login

users = Blueprint('users', __name__)


@users.route('/auth/google', methods=['POST'])
def authentification_with_google():
	try:
		email = request.form.get('email')
		name = request.form.get('name')
		if not email:
			print('Missing parameter email')
			abort(400)
		if not name:
			print('Missing parameter name')
			abort(400)
		usr = find_user_by_email(email)
		if not usr:
			user_created = create_user({
				'name': name,
				'username': '',
				'avatar_url': '',
				'web_url': '',
				'email': email,
			}, {
				'refresh_token': '',
				'access_token': '',
			})
			if not user_created:
				print(user_created)
				print('Errror while creating user {}'.format(email))
				abort(400)
			usr = find_user_by_email(email)
		add_logn = add_new_login(email)
		if not add_logn:
			print('error while trying to add new login for user {}'.format(email))
		print(usr)
		return jsonify({
			'user_id': str(usr['_id'])
		})
	except Exception as e:
		print(e)
		abort(400)