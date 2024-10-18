from flask import Flask
from routes.dashboard_routes import dashboard_bp
from routes.employees_routes import employees_bp
from routes.in_progress_routes import in_progress_bp
from services.core_services import secret_key

from routes.auth_routes import auth_bp

app = Flask(__name__)
app.secret_key = secret_key

# Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(in_progress_bp)
app.register_blueprint(employees_bp)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)