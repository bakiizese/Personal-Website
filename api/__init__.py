from .analytics import analytics_bp
from .contact import contact_bp
from .projects import projects_bp


def register_blueprints(app):
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(analytics_bp, url_prefix="/api")
    app.register_blueprint(projects_bp, url_prefix="/api")
