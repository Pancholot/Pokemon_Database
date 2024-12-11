import gevent
from app import mongo, bcrypt, socket_io
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
        self.requests: list = []

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
            "requests": self.requests,
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
    def add_friend(_id: str, _id_friend: str) -> bool:
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

        friend_list.append(_id_friend)
        friends_friend_list.append(_id)
        update: dict = {"$set": {"friends": friend_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged
        update2: dict = {"$set": {"friends": friends_friend_list}}
        result2 = mongo.db.trainers.update_one(filtro2, update2).acknowledged
        return result and result2

    @staticmethod
    def remove_friend(_id: str, _id_friend: str) -> bool:
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

    @staticmethod
    def find_request(_id: str, index: int) -> dict | None:
        if mongo.db is None:
            return
        filtro: dict = {"_id": ObjectId(_id)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        if not trainer:
            return
        requests: list = trainer["requests"]
        if index < 0 or index >= len(requests):
            return
        request: dict = requests[index]
        return request

    @staticmethod
    def send_friend_request(_id: str, _id_friend: str) -> bool:
        if mongo.db is None:
            return False

        filtro: dict = {}
        try:
            filtro = {"_id": ObjectId(_id_friend)}
        except:
            return False
        trainer_friend: dict | None = mongo.db.trainers.find_one(filtro)

        if not trainer_friend:
            return False

        friends_requests_list: list = trainer_friend.get("requests")
        if friends_requests_list is None:
            return False

        check: list = [
            req["sender"] for req in friends_requests_list if req["sender"] == _id
        ]

        if len(check) > 0 or _id in trainer_friend["friends"]:
            return False

        friends_requests_list.append({"sender": _id, "status": "pending"})
        update: dict = {"$set": {"requests": friends_requests_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged
        return result

    @staticmethod
    def accept_friend_request(_id: str, index: int) -> bool:
        if mongo.db is None:
            return False
        filtro: dict = {"_id": ObjectId(_id)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        if not trainer:
            return False
        friends_requests_list: list = trainer.get("requests")
        request: dict = friends_requests_list[index]
        if request["status"] != "pending":
            return False
        friends_requests_list[index]["status"] = "accepted"
        update: dict = {"$set": {"requests": friends_requests_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged
        return result

    @staticmethod
    def deny_friend_request(_id: str, index: int) -> bool:
        if mongo.db is None:
            return False
        filtro: dict = {"_id": ObjectId(_id)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        if not trainer:
            return False
        friends_requests_list: list = trainer.get("requests")
        request: dict = friends_requests_list[index]
        friends_requests_list.remove(request)
        update: dict = {"$set": {"requests": friends_requests_list}}
        result = mongo.db.trainers.update_one(filtro, update).acknowledged
        return result

    @staticmethod
    def get_friend_requests(_id: str) -> list | None:
        if mongo.db is None:
            return
        filtro: dict = {"_id": ObjectId(_id)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        if not trainer:
            return
        friend_requests: list = trainer.get("requests")
        return friend_requests

    @staticmethod
    def update_request(friend_added: str, _id: str) -> None:
        if mongo.db is None:
            return
        filtro: dict = {"_id": ObjectId(_id)}
        trainer: dict | None = mongo.db.trainers.find_one(filtro)
        if not trainer:
            return
        friend_requests_list: list = trainer.get("requests")
        for i, request in enumerate(friend_requests_list):
            if request["sender"] == friend_added:
                friend_requests_list.remove(request)
                update: dict = {"$set": {"requests": friend_requests_list}}
                mongo.db.trainers.update_one(filtro, update)
                return


def monitor_trainers():
    try:
        if mongo.db is None or not mongo.cx:
            return
        with mongo.db.trainers.watch() as change_stream:
            print("Escuchando cambios en la colección 'trainers'...")
            for change in change_stream:
                if change["operationType"] != "update":
                    continue
                updateDescription: dict = change["updateDescription"]
                _id: str = str(change["documentKey"]["_id"])
                for key, value in updateDescription["updatedFields"].items():
                    if "requests" in key and isinstance(value, list):
                        requests = value
                        data = {
                            "_id": _id,
                            "requests": requests,
                        }
                        socket_io.emit("updated_friend_requests", data)
                        for request in requests:
                            if request["status"] == "accepted":
                                Trainer.add_friend(request["sender"], _id)
                                Trainer.update_request(_id, request["sender"])
                                Trainer.update_request(request["sender"], _id)
                    if "friends" in key and isinstance(value, list):
                        friends = value
                        data = {
                            "_id": _id,
                            "friends": friends,
                        }
                        socket_io.emit("updated_friends", data)
        change_stream.close()
    except Exception as e:
        print(f"Error: {e}")


gevent.spawn(monitor_trainers)
