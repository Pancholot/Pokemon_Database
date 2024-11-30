from flask import Blueprint, jsonify, request
from app.models.mysql.pokemon import Pokemon
from app.models.mongo.trainer import Trainer
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
import random

capture_bp: Blueprint = Blueprint("capture_bp", __name__)


@capture_bp.route("/capture", methods=["GET", "PUT"])
@jwt_required()
def get_pokemon_pkx_num_rand_catch():
    trainer_id = get_jwt_identity()
    trainer: dict | None = Trainer.get_trainer_by_id(trainer_id)
    if trainer is None:
        return jsonify({"error": "Trainer not found"}), 404

    lista_entrenador: list[int] = trainer["pokemon_team"]

    lista_pokemon_to_catch = []

    while len(lista_pokemon_to_catch) < 3:
        num_random = random.randint(1, 801)
        if (
            num_random not in lista_pokemon_to_catch
            and num_random not in lista_entrenador
        ):
            lista_pokemon_to_catch.append(num_random)

    pokemones_to_catch = [
        Pokemon.get_one_by_pkx_num(str(num)) for num in lista_pokemon_to_catch
    ]

    # Si el método es GET, mostrar opciones
    if request.method == "GET":
        return (
            jsonify(
                {
                    "message": "Elige uno de estos Pokemon para capturar",
                    "pokemones_to_catch": pokemones_to_catch,
                    "lista_pokemon_to_catch": lista_pokemon_to_catch,
                }
            ),
            200,
        )

    # Si el método es POST, capturar la elección del usuario
    elif request.method == "PUT":
        data = request.get_json()
        pokemones_available = data.get("lista_pokemon_to_catch")
        elegido = data.get("pokemon_id")
        if elegido not in pokemones_available:
            return (
                jsonify({"error": "Elige un pokemon de la lista", "success": False}),
                400,
            )
        lista_entrenador.append(elegido)
        pokemones = [Pokemon.get_one_by_pkx_num(str(num)) for num in lista_entrenador]
        resultado = Trainer.add_pokemon_to_team(elegido, trainer_id)
        if resultado:
            return (
                jsonify(
                    {
                        "message": "Has capturado un nuevo Pokemon",
                        "nuevo_pokemon": Pokemon.get_one_by_pkx_num(str(elegido)),
                        "equipo_actualizado": pokemones,
                        "success": True,
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {"message": "No se pudo capturar el Pokemon", "success": False}
                ),
                400,
            )
