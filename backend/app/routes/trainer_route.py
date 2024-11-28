from flask import Blueprint, jsonify, request
from app.models.mongo.trainer import Trainer
import random

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
    if trainer:
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "success": True,
                    "trainer": {
                        "id": trainer["_id"],
                        "name": trainer["name"],
                        "region": trainer["region"],
                        "pokemon_team": trainer["pokemon_team"],
                    },
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Invalid credentials", "success": False}), 401
