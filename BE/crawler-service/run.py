from app import create_app
import os

app = create_app()

if __name__ == "__main__":
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host=HOST, port=PORT, debug=DEBUG)