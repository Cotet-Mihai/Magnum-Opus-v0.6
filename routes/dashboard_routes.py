from flask import Blueprint, session, render_template, redirect, url_for
from services.core_services import handle_dashboard_access

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def dashboard_admin():
    if 'user' in session:  # Check if user is in session

        user = session['user']  # Save user

        return handle_dashboard_access('Admin',
                                       render_template('dashboard.html', user=user)
                                       )

    else:
        return redirect(url_for('auth.auth'))  # If user does not exist return auth page
