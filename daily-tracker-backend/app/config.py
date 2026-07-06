import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dailygrind_secret_fallback_key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Read admin key for authorization of state changes
    ADMIN_KEY = os.environ.get("ADMIN_KEY", "GrindPass2026").strip()
    
    # Try fetching MySQL connection URLs
    database_uri = os.environ.get("DATABASE_URL") or os.environ.get("MYSQL_URL")
    
    if not database_uri:
        # Fallback to separate variables
        db_host = os.environ.get("DB_HOST", "").strip()
        db_port = os.environ.get("DB_PORT", "3306").strip()
        db_user = os.environ.get("DB_USER", "").strip()
        db_password = os.environ.get("DB_PASSWORD", "").strip()
        db_name = os.environ.get("DB_NAME", "").strip()
        
        if db_host and db_user:
            database_uri = f"mysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
    # Format database_uri for SQLAlchemy + PyMySQL
    if database_uri:
        if database_uri.startswith("mysql://"):
            database_uri = database_uri.replace("mysql://", "mysql+pymysql://", 1)
    else:
        # Local fallback database
        database_uri = "sqlite:///daily_tracker.db"
        
    SQLALCHEMY_DATABASE_URI = database_uri
    
    # Configure SSL if database is MySQL and DB_SSL is not explicitly disabled
    is_mysql = database_uri and "mysql" in database_uri
    is_railway = database_uri and "railway" in database_uri
    db_ssl = os.environ.get("DB_SSL", "true").lower() in ("true", "1")
    
    if is_mysql and (db_ssl or is_railway):
        SQLALCHEMY_ENGINE_OPTIONS = {
            "connect_args": {
                "ssl": {
                    # Enables standard SSL connection. Adjust options if specific CAs are needed.
                }
            }
        }

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

# Select config based on environment
config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}

def get_config():
    env = os.environ.get("FLASK_ENV", "production").lower()
    return config_by_name.get(env, ProductionConfig)
