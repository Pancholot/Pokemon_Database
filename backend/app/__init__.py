import atexit
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flaskext.mysql import MySQL
from app.config import Config
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

mongo: PyMongo = PyMongo()
mysql: MySQL = MySQL()
cors: CORS = CORS()
bcrypt: Bcrypt = Bcrypt()
jwt: JWTManager = JWTManager()
socket_io: SocketIO = SocketIO()


def create_app() -> tuple[Flask, SocketIO]:
    app: Flask = Flask(__name__)
    app.config.from_object(Config)
    cors.init_app(app)
    mysql.init_app(app)
    mongo.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    socket_io.init_app(
        app,
        cors_allowed_origins="*",
        async_mode="gevent",
        logger=True,
    )
    from app.routes.pokemon_route import pokemon_bp
    from app.routes.trade_route import trade_bp

    app.register_blueprint(pokemon_bp)
    from app.routes.trainer_route import trainer_bp

    app.register_blueprint(trainer_bp)
    from app.routes.captures_route import capture_bp

    app.register_blueprint(trade_bp)

    app.register_blueprint(capture_bp)

    return app, socket_io


def close_mongo_connection():
    if mongo.db is not None and mongo.cx:
        print("Cerrando conexión a MongoDB...")
        mongo.cx.close()


atexit.register(close_mongo_connection)
