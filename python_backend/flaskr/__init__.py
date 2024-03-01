import os
from flask import Flask
from . import db


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.postgres')
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_pyfile(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        print("Instance Folder Not Found!!")
        pass

    db.init_app(app)

    # ID ANALYZER: /api/idanalyzer
    from . import idAnalyzer
    app.register_blueprint(idAnalyzer.bp)

    @app.route("/test")
    def test():
        return "Hello World"

    return app
