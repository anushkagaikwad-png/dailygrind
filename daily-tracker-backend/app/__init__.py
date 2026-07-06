from flask import Flask
from flask_cors import CORS
from app.config import get_config
from app.models import db
from app.routes import api

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    conf = get_config()
    app.config.from_object(conf)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize DB
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(api, url_prefix="/api")
    
    # Initialize tables if they do not exist
    with app.app_context():
        try:
            db.create_all()
            print("Database tables initialized successfully.")
        except Exception as e:
            print(f"Error during database initialization: {e}")
            
    return app
