import functools

from flask import Blueprint, request
from flaskr.db import get_db

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/idanalyze', methods=['POST'])
def idAnalyze():
    if request.method == 'POST':
        print("/api/idanalyze")

    return "Hello World"
