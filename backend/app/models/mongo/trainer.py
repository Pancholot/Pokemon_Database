from app import mongo, bcrypt
from datetime import datetime
from bson import ObjectId
import re


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
        self.friends: list = []

    def to_dict(self) -> dict:
        """Función que permite representar al objeto trainer como diccionario

        Returns:
            dict: Trainer data
        """
        return {
            "name": self.name,
            "age": self.age,
            "region": self.region,
            "pokemon_team": self.pokemon_team,
            "created_at": self.created_at,
            "password": self.password,
            "mail": self.mail,
            "friends": self.friends,
        }

    @staticmethod
    def register_trainer(data: dict) -> bool:
        if mongo.db is None:
            return False
        new_data: dict = data
        new_data["password"] = bcrypt.generate_password_hash(
            new_data["password"]
        ).decode("utf-8")
        email: str | None = new_data.get("mail")
        email_regex = r"^[^@]+@[^@]+\.[^@]+$"
        if not email or not re.match(email_regex, email):
            return False
        trainer = Trainer(**new_data)
        result = mongo.db.trainers.insert_one(trainer.to_dict()).acknowledged
        return result

    @staticmethod
    def get_trainer_by_id(id: str) -> dict | None:
        if mongo.db is None:
            return None
        trainer: dict | None = mongo.db.trainers.find_one({"_id": ObjectId(id)})
        if trainer is None:
            return None
        trainer["_id"] = str(trainer["_id"])
        return trainer

    @staticmethod
    def login(mail: str, password: str) -> dict:
        if mongo.db is None:
            return {"message": "Internal server error", "success": False}

        trainer: dict | None = mongo.db.trainers.find_one({"mail": mail})
        if not trainer:
            return {"message": "Trainer not found", "success": False}

        if bcrypt.check_password_hash(trainer["password"], password):
            return {
                "message": "Success login",
                "success": True,
                "_id": str(trainer["_id"]),
            }
        else:
            return {"message": "Invalid credentials", "success": False}

    @staticmethod
    def add_pokemon_to_team(new_pokemon: int, _id: str):
        if mongo.db is None:
            return False
        result = mongo.db.trainers.update_one(
            {"_id": ObjectId(_id)}, {"$push": {"pokemon_team": new_pokemon}}
        ).acknowledged
        return result

    @staticmethod
    def add_friend(_id: str, _id_friend) -> bool:
        if mongo.db is None:
            return False
        filtro: dict = {"_id": ObjectId(_id)}

        trainer: dict | None = mongo.db.trainers.find_one(filtro)

        if not trainer:
            return False

        friend_list: list = trainer.get("friends")

        friend_list.append(_id_friend)

        update: dict = {"$set": {"friends": friend_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged

        return result

    @staticmethod
    def remove_friend(_id: str, _id_friend) -> bool:
        if mongo.db is None:
            return False
        filtro: dict = {"_id": ObjectId(_id)}
        filtro2: dict = {"_id": ObjectId(_id_friend)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        trainer_friend: dict | None = mongo.db.trainers.find_one(filtro2)
        if not trainer or not trainer_friend:
            return False

        friend_list: list = trainer.get("friends")
        friends_friend_list: list = trainer_friend.get("friends")

        friend_list.remove(_id_friend)
        friends_friend_list.remove(_id)
        update: dict = {"$set": {"friends": friend_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged
        update2: dict = {"$set": {"friends": friends_friend_list}}
        result2 = mongo.db.trainers.update_one(filtro2, update2).acknowledged
        return result and result2


def monitor_trainers():
    try:
        if mongo.db is None or not mongo.cx:
            return
        with mongo.db.trainers.watch() as change_stream:
            print("Escuchando cambios en la colección 'trainers'...")
            for change in change_stream:
                if change["operationType"] == "update":
                    fullDocument: dict = change["fullDocument"]
                    print("Documento actualizado:", change["updateDescription"])

    except KeyboardInterrupt:
        print("Deteniendo...")
    finally:
        if mongo.cx and mongo.db is not None:
            mongo.db.client.close()
            mongo.cx.close()
