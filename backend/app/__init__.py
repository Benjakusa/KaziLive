from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from .routes.jobseeker_routes import bp as jobseeker_bp

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app)
    
    # Initialize Cloudinary
    from .services.cloudinary_service import init_cloudinary
    init_cloudinary(app)

    from .models import user, document, payment, contact

    from .routes.main_routes import bp as main_bp
    from .routes.auth_routes import bp as auth_bp
    from .routes.user_routes import bp as user_bp
    from .routes.admin_routes import bp as admin_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(jobseeker_bp)

    # Register error handlers
    from .utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    return app
