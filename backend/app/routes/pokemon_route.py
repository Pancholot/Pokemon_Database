from flask import Blueprint, jsonify, request
from app.models.mysql.pokemon import Pokemon
import random

pokemon_bp: Blueprint = Blueprint("pokemon_bp", __name__)


@pokemon_bp.route("/pokemon", methods=["GET"])
def get_pokemons():
    pokemons = Pokemon.get_all()
    return jsonify(pokemons), 200


@pokemon_bp.route("/pokemon/get", methods=["GET"])
def get_pokemons_from():
    pokedex_numbers = request.args.getlist("pokemon_list[]")
    if pokedex_numbers:
        pokemons = Pokemon.get_from_list(pokedex_numbers)

        return jsonify(pokemons), 200
    return jsonify({"message": "Error"}), 400


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
    num_random: int = random.randint(1, 801)
    pokemon = Pokemon.get_one_by_pkx_num(str(num_random))
    return jsonify(pokemon), 200
