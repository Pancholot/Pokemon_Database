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
