from flask import Blueprint, jsonify
from app.models.pokemon import Pokemon
import random

pokemon_bp: Blueprint = Blueprint("pokemon_bp", __name__)


@pokemon_bp.route("/pokemon", methods=["GET"])
def get_pokemons():
    pokemons = Pokemon.get_all()
    return jsonify(pokemons), 200


@pokemon_bp.route("/pokemon/even", methods=["GET"])
def get_pokemons_even():
    pokemons = Pokemon.get_all_even()
    return jsonify(pokemons), 200


@pokemon_bp.route("/pokemon/<pkx_num>", methods=["GET"])
def get_pokemon_pkx_num(pkx_num: str):
    pokemon = Pokemon.get_one_by_pkx_num(pkx_num)
    return jsonify(pokemon), 200


@pokemon_bp.route("/pokemon/rand", methods=["GET"])
def get_pokemon_pkx_num_rand():
    listafake = [1, 5, 97, 301, 4]
    num_random: int = random.randint(1, 801)
    while num_random in listafake:
        print("CAYO")
        num_random = random.randint(1, 801)

    listafake.append(num_random)
    print(listafake)
    pokemon = Pokemon.get_one_by_pkx_num(str(num_random))
    return jsonify(pokemon), 200


import random
from flask import jsonify, request


@pokemon_bp.route("/pokemon/capture", methods=["GET", "POST"])
def get_pokemon_pkx_num_rand_catch():
    # Lista de Pokemon del entrenador
    lista_entrenador = [1, 5, 97, 301, 4]

    # Generar 3 Pokemon aleatorios diferentes
    lista_pokemon_to_catch = []
    while len(lista_pokemon_to_catch) < 3:
        num_random = random.randint(1, 801)
        if (
            num_random not in lista_pokemon_to_catch
            and num_random not in lista_entrenador
        ):
            lista_pokemon_to_catch.append(num_random)

    # Obtener datos de los 3 Pokemon disponibles para capturar
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
        data = request.get_json()
        elegido = data.get("pokemon_id")

        # Validar si el Pokémon elegido está en la lista
        if elegido in lista_pokemon_to_catch:
            lista_entrenador.append(elegido)
            pokemones = [
                Pokemon.get_one_by_pkx_num(str(num)) for num in lista_entrenador
            ]
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
            return jsonify({"error": "El Pokemon elegido no es válido"}), 400


# HACER 16 GETS SOBRE LOS 16 POKEMON
