from flask import Flask
from flask_cors import CORS

from api import register_blueprints
from config import DevelopmentConfig
from utils.logger import configure_logging


def create_app(config=DevelopmentConfig):
    configure_logging()

    app = Flask(__name__, static_folder=".", static_url_path="")
    app.config.from_object(config)

    CORS(app, origins=app.config["CORS_ORIGINS"])

    register_blueprints(app)

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    @app.errorhandler(404)
    def not_found(e):
        return {"error": "Resource not found."}, 404

    @app.errorhandler(429)
    def rate_limited(e):
        return {"error": "Rate limit exceeded. Retry after 60 seconds."}, 429

    @app.errorhandler(413)
    def payload_too_large(e):
        return {"error": "Request payload exceeds 16 KB limit."}, 413

    return app
    
app = create_app()

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
