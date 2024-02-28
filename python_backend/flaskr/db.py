import click
from flask import current_app, g
import psycopg2


def get_db():
    if 'db' not in g:
        conn = psycopg2.connect(dbname="shopicom", user="postgres", host="localhost", port="5432", password="2002")
        g.db = conn.cursor()
        print("Successfully connected to database")

    return g.db


def close_db():
    db = g.pop('db', None)

    if db is not None:
        db.close()


# def init_db():
#     db = get_db()
#
#     with current_app.open_resource('schema.postgres') as f:
#         db.execute("""""")
#
#
# @click.command('init-db')
# def init_db_command():
#     """Clear the existing data and create new tables."""
#     init_db()
#     click.echo('Initialized the database.')
#
#
# def init_app(app):
#     app.teardown_appcontext(close_db)
#     app.cli.add_command(init_db_command)
