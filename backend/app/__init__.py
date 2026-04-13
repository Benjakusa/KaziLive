from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

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
    cors.init_app(app, origins=["https://kazilive-eta.vercel.app"])
    
    # Initialize Cloudinary
    try:
        from .services.cloudinary_service import init_cloudinary
        init_cloudinary(app)
    except ImportError:
        pass

    from .models import user, document, payment, contact, promotion

    from .routes.main_routes import bp as main_bp
    from .routes.auth_routes import bp as auth_bp
    from .routes.user_routes import bp as user_bp
    from .routes.admin_routes import bp as admin_bp
    from .routes.jobseeker_routes import bp as jobseeker_bp
    from .routes.employer_routes import bp as employer_bp
    
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(jobseeker_bp)
    app.register_blueprint(employer_bp)
    
    # Register payment routes (optional)
    try:
        from .routes.payment_routes import bp as payment_bp
        app.register_blueprint(payment_bp)
    except ImportError:
        pass
    
    # Register promotion routes
    try:
        from .routes.promotion_routes import bp as promotion_bp
        app.register_blueprint(promotion_bp)
    except ImportError:
        pass
    
    # Register advert routes
    try:
        from .routes.advert_routes import bp as advert_bp
        app.register_blueprint(advert_bp)
    except ImportError:
        pass
    
    # Register error handlers
    try:
        from .utils.error_handlers import register_error_handlers
        register_error_handlers(app)
    except ImportError:
        pass
    
    # Register Swagger (optional)
    try:
        from .swagger import swaggerui_blueprint, SWAGGER_URL
        app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)
    except ImportError:
        pass
    
    return app
