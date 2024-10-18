from flask import Blueprint, session, render_template, redirect, url_for
from services.core_services import handle_dashboard_access

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
def dashboard_admin():
    """
    Renders the admin dashboard if the user is authenticated and has the 'Admin' role.

    :return: Returns the rendered dashboard template if the user is an admin,
    or redirects to the authentication page if the user is not authenticated.
    """

    if 'user' in session:  # Check if user is in session

        user = session['user']  # Save user

        return handle_dashboard_access(user[5],
                                       render_template('dashboard.html',
                                                       user=user,
                                                       employees_page='employees.employees_admin',
                                                       locations_page='in_progress.in_progress',
                                                       warehouses_page='in_progress.in_progress',
                                                       tickets_page='in_progress.in_progress',
                                                       openings_page='in_progress.in_progress')
                                       )

    else:
        return redirect(url_for('auth.auth'))  # If user does not exist return auth page
