from threading import Thread
from flask import Flask
from app import create_app
from app.models.mongo.trade import monitor_trades


monitor_thread = Thread(target=monitor_trades, daemon=True)
monitor_thread.start()
app: Flask = create_app()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
