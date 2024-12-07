from threading import Thread
from flask import Flask
from app import create_app
from app.models.mongo.trade import monitor_trades
from app.models.mongo.trainer import monitor_trainers


app: Flask = create_app()


if __name__ == "__main__":
    monitor_thread1 = Thread(target=monitor_trades, daemon=True)
    monitor_thread1.start()
    monitor_thread2 = Thread(target=monitor_trainers, daemon=True)
    monitor_thread2.start()
    app.run(debug=True, port=5000, host="0.0.0.0")
