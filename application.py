from flask import Flask
from app import create_app
from app.models.mongo.trade import monitor_trades

app: Flask = create_app()
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
    try:
        monitor_trades()
    except KeyboardInterrupt:
        print("\nDeteniendo el monitoreo...")
