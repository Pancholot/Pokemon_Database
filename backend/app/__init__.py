from flask import Flask
from flask_cors import CORS
from flaskext.mysql import MySQL
from app.config import Config
from flask_pymongo import PyMongo

mongo: PyMongo = PyMongo()
mysql: MySQL = MySQL()
cors: CORS = CORS()


def create_app() -> Flask:
    app: Flask = Flask(__name__)
    app.config.from_object(Config)
    cors.init_app(app)
    mysql.init_app(app)
    mongo.init_app(app)
    from app.routes.pokemon_route import pokemon_bp

    app.register_blueprint(pokemon_bp)
    from app.routes.trainer_route import trainer_bp

    app.register_blueprint(trainer_bp)
    from app.routes.captures_route import capture_bp

    app.register_blueprint(capture_bp)

    return app