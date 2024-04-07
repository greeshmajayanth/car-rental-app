from flask import Flask
from app.user_auth import auth_bp
from app.view import view_bp
from app.create import create_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(view_bp, url_prefix='/view')
    app.register_blueprint(create_bp, url_prefix='/create')
    return app

