from flask import Blueprint, jsonify, request
from app.models.mysql.pokemon import Pokemon
from app.models.mongo.trainer import Trainer
import random

capture_bp: Blueprint = Blueprint("capture_bp", __name__)


@capture_bp.route("/capture", methods=["GET", "POST"])
def get_pokemon_pkx_num_rand_catch():
    data = request.get_json()
    trainer_id = data.get("_id")
    trainer = Trainer.get_trainer_by_id(trainer_id)

    lista_entrenador = trainer["pokemon_team"]

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
                }
            ),
            200,
        )

    # Si el método es POST, capturar la elección del usuario
    elif request.method == "POST":

        elegido = data.get("pokemon_id")

        # Validar si el Pokémon elegido está en la lista

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
                    }
                ),
                200,
            )
        else:
            return (
                jsonify({"message": "No se pudo capturar el Pokemon"}),
                400,
            )
