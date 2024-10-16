from flask import Blueprint, session, redirect, url_for, render_template

from services.core_services import handle_dashboard_access

employees_bp = Blueprint('employees', __name__)




@employees_bp.route('/employees')
def employees_admin():
    if 'user' in session:

        user = session['user']

        return handle_dashboard_access('Admin', render_template('employees.html',
                                                                active_page='employees',
                                                                user=user))

    else:
        return redirect(url_for('auth.auth'))