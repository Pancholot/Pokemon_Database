from typing import Any
from app import mysql
from pymysql.cursors import Cursor


class Pokemon:

    def __init__(
        self,
        pokedex_number: int,
        name: str,
        abilities: str,
        attack: int,
        defense: int,
        speed: int,
        hp: int,
        sp_attack: int,
        sp_defense: int,
        base_total: int,
        base_egg_steps: int,
        base_happiness: int,
        weight_kg: float,
        height_m: float,
        capture_rate: int,
        classification: str,
        type1: str,
        type2: str,
        experience_growth: int,
        percentage_male: float,
        generation: int,
        is_legendary: str,
    ):
        self.pokedex_number: int = pokedex_number
        self.name: str = name
        self.abilities: str = abilities
        self.attack: int = attack
        self.defense: int = defense
        self.speed: int = speed
        self.hp: int = hp
        self.sp_attack: int = sp_attack
        self.sp_defense: int = sp_defense
        self.base_total: int = base_total
        self.base_egg_steps: int = base_egg_steps
        self.base_happiness: int = base_happiness
        self.weight_kg: float = weight_kg
        self.height_m: float = height_m
        self.capture_rate: int = capture_rate
        self.classification: str = classification
        self.type1: str = type1
        self.type2: str = type2
        self.experience_growth: int = experience_growth
        self.percentage_male: float = percentage_male
        self.generation: int = generation
        self.is_legendary: str = is_legendary

    def to_dict(self):
        return {
            "pokedex_number": self.pokedex_number,
            "name": self.name,
            "abilities": self.abilities,
            "attack": self.attack,
            "defense": self.defense,
            "speed": self.speed,
            "hp": self.hp,
            "sp_attack": self.sp_attack,
            "sp_defense": self.sp_defense,
            "base_total": self.base_total,
            "base_egg_steps": self.base_egg_steps,
            "base_happiness": self.base_happiness,
            "weight_kg": self.weight_kg,
            "height_m": self.height_m,
            "capture_rate": self.capture_rate,
            "classification": self.classification,
            "type1": self.type1,
            "type2": self.type2,
            "experience_growth": self.experience_growth,
            "percentage_male": self.percentage_male,
            "generation": self.generation,
            "is_legendary": self.is_legendary,
        }

    @staticmethod
    def get_all():
        database: Any | None = mysql.get_db()
        if database is None:
            return []
        cursor: Cursor = database.cursor()
        cursor.execute("SELECT * FROM pokemon")
        rows = cursor.fetchall()
        return [Pokemon(*row).to_dict() for row in rows]

    def get_from_list(pokemon_list: list):
        database: Any | None = mysql.get_db()
        if database is None:
            return []
        cursor: Cursor = database.cursor()
        query = "SELECT * FROM pokemon WHERE pokedex_number IN (%s)" % ", ".join(
            ["%s"] * len(pokemon_list)
        )
        cursor.execute(query, pokemon_list)
        rows = cursor.fetchall()

        return [Pokemon(*row).to_dict() for row in rows]

    @staticmethod
    def get_all_even():
        database: Any | None = mysql.get_db()
        if database is None:
            return []
        cursor: Cursor = database.cursor()
        cursor.execute("SELECT * FROM pokemon WHERE MOD(pokedex_number,2) = 0 ")
        rows: tuple[tuple[Any, ...], ...] = cursor.fetchall()
        cursor.close()
        return [Pokemon(*row).to_dict() for row in rows]

    @staticmethod
    def get_one_by_pkx_num(pkx_num: str) -> dict:
        database: Any | None = mysql.get_db()
        if database is None:
            return {}
        cursor: Cursor = database.cursor()
        cursor.execute(f"SELECT * FROM pokemon WHERE  pokedex_number = {pkx_num}")
        row: tuple | None = cursor.fetchone()
        cursor.close()
        if row is None:
            return {}
        return Pokemon(*row).to_dict()
