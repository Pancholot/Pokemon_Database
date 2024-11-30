from app import mongo
from datetime import datetime
from bson import ObjectId


def monitor_trades():
    if mongo.db is None or not mongo.cx:
        return
    with mongo.db.trades.watch() as change_stream:
        print("Escuchando cambios en la colección 'trades'...")
        for change in change_stream:
            if change["operationType"] == "update":
                fullDocument: dict = change["fullDocument"]
                if fullDocument["trade_status"] == "confirmed":
                    trainer_id: str = fullDocument["trainer_id"]
                    friend_id: str = fullDocument["friend_id"]
                    pokemon_traded: int = fullDocument["pokemon_traded"]
                    pokemon_received: int = fullDocument["pokemon_received"]

                    filtro_trainer: dict = {"_id": ObjectId(trainer_id)}
                    trainer: dict | None = mongo.db.trainers.find_one(filtro_trainer)
                    filtro_friend: dict = {"_id:": ObjectId(friend_id)}
                    friend: dict | None = mongo.db.trainers.find_one(filtro_friend)
                    if trainer and friend:
                        team: list = trainer["pokemon_team"]
                        friend_team: list = friend["pokemon_team"]
                    else:
                        print("No se encontraron los entrenadores")
                        continue

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
                        print(
                            f"El entrenador {friend_id} ha recibido {pokemon_received}"
                        )
                        team.append(pokemon_received)
                        friend_team.remove(pokemon_received)
                        case2 = True

                    result1: bool = mongo.db.trainers.update_one(
                        filtro_trainer, {"$set": {"pokemon_team": team}}
                    ).acknowledged
                    result2: bool = mongo.db.trainers.update_one(
                        filtro_friend, {"$set": {"pokemon_team": friend_team}}
                    ).acknowledged

                    print(
                        f"RESULTADO:  {str((case1 and case2) and (result1 and result2))}"
                    )
                    print("Documento actualizado:", change["updateDescription"])


class Trade:

    def __init__(
        self,
        trainer_id: str,
        friend_id: str,
        pkm_traded: int,
        pkm_received: int,
        trade_status: str,
    ):
        self.trainer_id: str = trainer_id
        self.friend_id: str = friend_id
        self.pkm_traded: int = pkm_traded
        self.pkm_received: int = pkm_received
        self.trade_date: datetime = datetime.now()
        self.trade_status: str = trade_status

    def to_dict(self) -> dict:
        return {
            "trainer_id": self.trainer_id,
            "friend_id": self.friend_id,
            "pkm_traded": self.pkm_traded,
            "pkm_received": self.pkm_received,
            "trade_date": self.trade_date,
            "trade_status": self.trade_status,
        }

    @staticmethod
    def request_trade(data: dict) -> bool:
        if mongo.db is None:
            return False
        trade: Trade = Trade(**data)
        result: bool = mongo.db.trades.insert_one(trade.to_dict()).acknowledged
        return result

    @staticmethod
    def confirm_trade(data: dict) -> bool:
        if mongo.db is None:
            return False
        confirm: str | None = data.get("trade_status")
        trade_id: str | None = data.get("trade_id")
        filtro: dict = {"_id": ObjectId(trade_id)}
        new_value: dict = {"$set": {"trade_status": confirm}}
        result: bool = mongo.db.trades.find_one_and_update(
            filtro, new_value
        ).acknowledged
        return result

    @staticmethod
    def get_pending_trades(trainer_id: str) -> list | None:
        if mongo.db is None:
            return None
        pending_trades: list = list(
            mongo.db.trainers.find({"friend_id": trainer_id, "trade_status": "pending"})
        )
        return pending_trades
