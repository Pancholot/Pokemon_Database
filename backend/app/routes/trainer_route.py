from flask import Blueprint, jsonify, request
from app.models.mongo.trainer import Trainer
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from datetime import timedelta

trainer_bp: Blueprint = Blueprint("trainer_bp", __name__)


@trainer_bp.route("/trainer/register", methods=["POST"])
def register_trainer():
    data = request.get_json()
    success = Trainer.register_trainer(data)
    return jsonify({"message": "Action completed", "success": success}), (
        201 if success else 200
    )


@trainer_bp.route("/trainer/login", methods=["POST"])
def login_trainer():
    data = request.get_json()
    mail = data.get("mail")
    password = data.get("password")
    if not mail or not password:
        return (
            jsonify({"message": "Email and password are required", "success": False}),
            400,
        )
    trainer = Trainer.login(mail, password)
    if trainer["success"]:
        access_token: str = create_access_token(identity=trainer.get("_id"), expires_delta=timedelta(hours=1), fresh=True)
        refresh_token: str = create_refresh_token(identity=trainer.get("_id"), expires_delta=timedelta(days=7))
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return jsonify({"message": "Invalid credentials", "success": False}), 401

@trainer_bp.route("/trainer/refresh", methods=["POST"])
@jwt_required(refresh=True, verify_type=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(
        identity=identity, expires_delta=timedelta(hours=1)
    )
    if request.json:
        new_refresh_token = request.json.get("refresh", False)
        if new_refresh_token:
            refresh_token = create_refresh_token(
                identity=identity, expires_delta=timedelta(days=7)
            )
            return jsonify(access_token=access_token, new_refresh_token=refresh_token)

    return jsonify(access_token=access_token)

@trainer_bp.route("/trainer", methods=["GET"])
@jwt_required()
def get_trainer():
    identity : str = get_jwt_identity()
    trainer : dict = Trainer.get_trainer_by_id(identity)   
    return jsonify(
                {
                    "trainer": {
                        "_id": trainer["_id"],
                        "name": trainer["name"],
                        "region": trainer["region"],
                        "pokemon_team": trainer["pokemon_team"],
                    },
                }
            ),200