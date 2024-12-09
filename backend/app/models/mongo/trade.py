from app import mongo
from datetime import datetime
from bson import ObjectId


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
    def get_request(trade_id) -> dict:
        if mongo.db is None:
            return False
        filtro: dict = {"_id": ObjectId(trade_id)}
        trade: dict = mongo.db.trades.find_one(filtro)
        return trade

    @staticmethod
    def confirm_trade(data: dict) -> bool:
        if mongo.db is None:
            return False
        trade_id: str | None = data.get("trade_id")
        filtro: dict = {"_id": ObjectId(trade_id)}
        new_value: dict = {"$set": {"trade_status": "confirmed"}}
        result: bool = mongo.db.trades.update_one(filtro, new_value).acknowledged
        return result

    @staticmethod
    def deny_trade(data: dict) -> bool:
        if mongo.db is None:
            return False
        trade_id: str | None = data.get("trade_id")
        filtro: dict = {"_id": ObjectId(trade_id)}
        new_value: dict = {"$set": {"trade_status": "denied"}}
        result: bool = mongo.db.trades.update_one(filtro, new_value).acknowledged
        return result

    @staticmethod
    def get_pending_trades(trainer_id: str) -> list | None:
        if mongo.db is None:
            return None
        pending_trades: list = list(
            mongo.db.trades.find({"friend_id": trainer_id, "trade_status": "pending"})
        )
        for p in pending_trades:
            p["_id"] = str(p["_id"])

        return pending_trades

    @staticmethod
    def get_pending_trades_specific(trainer_id: str, friend_id: str) -> list | None:
        if mongo.db is None:
            return None
        pending_trades: list = list(
            mongo.db.trades.find(
                {
                    "trainer_id": friend_id,
                    "friend_id": trainer_id,
                    "trade_status": "pending",
                }
            )
        )
        for p in pending_trades:
            p["_id"] = str(p["_id"])

        return pending_trades


def monitor_trades():
    try:
        if mongo.db is None or not mongo.cx:
            return
        with mongo.db.trades.watch() as change_stream:
            print("Escuchando cambios en la colección 'trades'...")
            for change in change_stream:
                if change["operationType"] == "update":

                    updateDescription: dict = change["updateDescription"]
                    for key, value in updateDescription["updatedFields"].items():

                        if "trade_status" in key:
                            if value == "confirmed":
                                _id: str = str(change["documentKey"]["_id"])
                                trade: dict = Trade.get_request(_id)
                                print(trade)
                                trainer_id: str = trade["trainer_id"]
                                friend_id: str = trade["friend_id"]
                                pokemon_traded: int = trade["pkm_traded"]
                                pokemon_received: int = trade["pkm_received"]
                                print(friend_id)

                                filtro_trainer: dict = {"_id": ObjectId(trainer_id)}
                                trainer: dict | None = mongo.db.trainers.find_one(
                                    filtro_trainer
                                )
                                filtro_friend: dict = {"_id": ObjectId(friend_id)}
                                friend: dict | None = mongo.db.trainers.find_one(
                                    filtro_friend
                                )

                                if trainer is not None and friend is not None:
                                    team: list = trainer["pokemon_team"]
                                    friend_team: list = friend["pokemon_team"]
                                else:
                                    print("No se encontraron los entrenadores")
                                    continue

                                case1: bool = False
                                case2: bool = False
                                if (
                                    pokemon_traded in team
                                    and pokemon_traded not in friend_team
                                ):
                                    print(
                                        f"El entrenador {trainer_id} ha intercambiado {pokemon_traded}"
                                    )
                                    team.remove(pokemon_traded)
                                    friend_team.append(pokemon_traded)
                                    case1 = True

                                if (
                                    pokemon_received not in team
                                    and pokemon_received in friend_team
                                ):
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
                                    filtro_friend,
                                    {"$set": {"pokemon_team": friend_team}},
                                ).acknowledged

                                print(
                                    f"RESULTADO:  {str((case1 and case2) and (result1 and result2))}"
                                )
                                print(
                                    "Documento actualizado:",
                                    change["updateDescription"],
                                )

    except KeyboardInterrupt:
        print("Deteniendo...")
        if mongo.cx:
            mongo.cx.close()
        if mongo.db is not None:
            mongo.db.client.close()
