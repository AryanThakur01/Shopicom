import click
from flask import current_app, g
import psycopg2


def get_db():
    if 'db' not in g:
        conn = psycopg2.connect(dbname="shopicom", user="postgres", host="localhost", port="5432", password="2008")
        g.db = conn

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            with current_app.open_resource("schema.sql") as f:
                cur.execute(f.read().decode('utf-8'))

        conn.commit()
    except psycopg2.Error as e:
        print(e)


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
