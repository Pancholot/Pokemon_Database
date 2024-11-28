from app import mongo
from datetime import datetime
from bson import ObjectId


class Trainer:
    def __init__(self, name: str, age: int, region: str, password: str, mail: str):
        """Este objeto crea un trainer

        Args:
            name (str): nombre del entrenador
            age (int): edad del entrenador
            region (str): region del entrenador
            password (str): passwordseña del usuario
            mail (str): mail del usuario
        """
        self.name: str = name
        self.age: int = age
        self.region: str = region
        self.pokemon_team: list = []
        self.created_at: datetime = datetime.now()
        self.password: str = password
        self.mail: str = mail

    def to_dict(self):
        return {
            "name": self.name,
            "age": self.age,
            "region": self.region,
            "pokemon_team": self.pokemon_team,
            "created_at": self.created_at,
            "password": self.password,
            "mail": self.mail,
        }

    @staticmethod
    def register_trainer(data: dict):
        if mongo.db is None:
            return False
        trainer = Trainer(**data)
        result = mongo.db.trainers.insert_one(trainer.to_dict()).acknowledged
        return result

    @staticmethod
    def get_trainer_by_id(id: str):
        if mongo.db is None:
            return None
        trainer = mongo.db.trainers.find_one({"_id": ObjectId(id)})
        return trainer

    @staticmethod
    def login(mail: str, password: str):
        if mongo.db is None:
            return None
        trainer = mongo.db.trainers.find_one({"mail": mail, "password": password})
        if trainer:
            # Convertir el _id de ObjectId a string
            trainer["_id"] = str(trainer["_id"])
        return trainer

    @staticmethod
    def add_pokemon_to_team(new_pokemon: int, _id: str):
        if mongo.db is None:
            return False
        result = mongo.db.trainers.update_one(
            {"_id": ObjectId(_id)}, {"$push": {"pokemon_team": new_pokemon}}
        ).acknowledged
        return result
