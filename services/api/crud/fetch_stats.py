from flask_pymongo import MongoClient
import os, datetime, json

mongo = MongoClient(os.environ['db_link'])[os.environ['database_name']]

def insert_new_fetch_request(email: str) -> None:
    '''
        An user requested a new fetch of data (login or refreshing browser page)
    '''
    mongo.fetch.insert_one({
        'email': email,
        'created_at': datetime.datetime.now().isoformat()
    })

def get_last_fetch_request(email: str):
    to_find = mongo.fetch.find({
        'email': email,
    }).sort('created_at', -1).limit(1)
    output = []
    for i in to_find:
        output.append(i)
    if (len(output)) == 0:
        return (False)
    return (output[0])