from flask import Blueprint, request, jsonify
from ..database.functions.merges import find_all_merges_by_username

graphs = Blueprint('graphs', __name__)

@graphs.route('/merges-per-week')
def get_data():
    data = find_all_merges_by_username(request.args.get('login'))
    output = []
    month = 0
    while month < 12:
        total_month = 0
        month += 1
        for item in data:
            if item['state'] == 'merged':
                if int(item['merged_at'].split('-')[1]) == month:
                    total_month += 1
        output.append(total_month)
    return (jsonify(output))