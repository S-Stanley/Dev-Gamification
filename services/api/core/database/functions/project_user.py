from flask_pymongo import MongoClient
import os

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def find_project_user(project_id, username):
    to_find = mongo.project_user.find_one({
        'username': username,
        'project_id': project_id
    })
    return (to_find)

def create_project_user(project_id, username) -> None:
    if find_project_user(project_id, username):
        return
    mongo.project_user.insert_one({
        'project_id': project_id,
        'username': username
    })

def find_all_project_user_by_usermame(username):
    to_find = mongo.project_user.find({
        'username': username
    })
    output = []
    for i in to_find:
        output.append(i)
    return (output)

def find_all_project_user_by_repo_id(repo_id: str):
    to_find = mongo.project_user.find({
        'repo_id': repo_id,
    })
    output = []
    for i in to_find:
        i['_id'] = str(i['_id'])
        output.append(i)
    return (output)
