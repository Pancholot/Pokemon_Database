from app import mongo
from datetime import datetime
from bson import ObjectId


def monitor_trades():
    with mongo.db.trades.watch() as change_stream:
        print("Escuchando cambios en la colección 'trades'...")
        for change in change_stream:
            # Manejar diferentes tipos de operaciones
            if change["operationType"] == "insert":
                # Manejar la inserción de un nuevo trade
                fullDocument: dict = change["fullDocument"]
                trainer_id: str = fullDocument["trainer_id"]
                friend_id: str = fullDocument["friend_id"]
                pokemon_traded: int = fullDocument["pokemon_traded"]
                pokemon_received: int = fullDocument["pokemon_received"]

                filtro_trainer: dict = {"_id": ObjectId(trainer_id)}
                trainer: dict = mongo.db.trainers.find_one(filtro_trainer)
                filtro_friend: dict = {"_id:": ObjectId(friend_id)}
                friend: dict = mongo.db.trainers.find_one(filtro_friend)
                team: list = trainer["pokemon_team"]
                friend_team: list = friend["pokemon_team"]

                case1: bool = False
                case2: bool = False
                if pokemon_traded in team and pokemon_traded not in friend_team:
                    print(
                        f"El entrenador {trainer_id} ha intercambiado {pokemon_traded}"
                    )
                    team.remove(pokemon_traded)
                    friend_team.append(pokemon_traded)
                    case1 = True

                if pokemon_received not in team and pokemon_received in friend_team:
                    print(f"El entrenador {friend_id} ha recibido {pokemon_received}")
                    team.append(pokemon_received)
                    friend_team.remove(pokemon_received)
                    case2 = True

                result1: bool = mongo.db.trainers.update_one(
                    filtro_trainer, {"$set": {"pokemon_team": team}}
                ).acknowledged
                result2: bool = mongo.db.trainers.update_one(
                    filtro_friend, {"$set": {"pokemon_team": friend_team}}
                ).acknowledged

                print(f"RESULTADO:  {str((case1 and case2) and (result1 and result2))}")

            elif change["operationType"] == "update":
                print("Documento actualizado:", change["updateDescription"])
            elif change["operationType"] == "delete":
                print("Documento eliminado con _id:", change["documentKey"]["_id"])


class Trade:

    def __init__(
        self, trainer_id, friend_id, pkm_traded, pkm_received, trade_date, trade_status
    ):
        pass
