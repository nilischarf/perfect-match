from flask import Flask, jsonify  
from flask_cors import CORS

from config import Config
from extensions import db, ma, login_manager, bcrypt

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.matchmaker_routes import matchmakers_bp
from routes.male_single_routes import male_singles_bp
from routes.female_single_routes import female_singles_bp
from routes.matches_routes import matches_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app,
     supports_credentials=True,
     origins=["http://localhost:3000"])

    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    login_manager.login_view = None

    @login_manager.unauthorized_handler
    def unauthorized():
        return jsonify({"error": "Unauthorized"}), 401

    from models import User, Matchmaker, MaleSingle, FemaleSingle, Match

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(matchmakers_bp, url_prefix="/api/matchmakers")
    app.register_blueprint(male_singles_bp, url_prefix="/api/male_singles")
    app.register_blueprint(female_singles_bp, url_prefix="/api/female_singles")
    app.register_blueprint(matches_bp, url_prefix="/api/matches")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5001)
