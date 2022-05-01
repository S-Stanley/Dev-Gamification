from crypt import methods
import json
from flask import Blueprint, request, jsonify
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
			return jsonify('Missing parameter email', 400)
		if not name:
			print('Missing parameter name')
			return jsonify('Missing parameter name', 400)
		usr = find_user_by_email(email)
		if not usr:
			user_created = create_user({
				'name': name,
				'username': '',
				'avatar_url': '',
				'web_url': '',
				'email': email,
				'refresh_token': '',
				'access_token': '',
			})
			if not user_created:
				print('Errror while creating user {}'.format(email))
				return jsonify('Errror while creating user', 400)
		add_logn = add_new_login(email)
		if not add_logn:
			print('error while trying to add new login for user {}'.format(email))
		return jsonify(True, 200)
	except Exception as e:
		print(e)
		return jsonify("There was a error on our side, please try again later", 400)