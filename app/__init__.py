from flask import Flask
from flask_cors import CORS
from flaskext.mysql import MySQL
from app.config import Config


mysql: MySQL = MySQL()
cors: CORS = CORS()


def create_app() -> Flask:
    app: Flask = Flask(__name__)
    app.config.from_object(Config)
    cors.init_app(app)
    mysql.init_app(app)
    from app.routes.pokemon_route import pokemon_bp

    app.register_blueprint(pokemon_bp)
    return app
