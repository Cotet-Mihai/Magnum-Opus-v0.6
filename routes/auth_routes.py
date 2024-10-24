from flask import Blueprint, request, render_template, session, redirect, url_for, jsonify
from services.auth_services import verify_auth


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/')
def auth():
    """
    Displays the login page.

    Checks if the user is already logged in and redirects them
    to the appropriate dashboard based on their role.

    :return: HTML response that renders the 'login.html' template
             if the user is not logged in; otherwise, redirects to
             the corresponding dashboard.
    :raises: None
    """
    if 'user' in session:
        if session['user'][5] == 'Admin':
                return redirect(url_for('dashboard.dashboard_admin'))  # Redirects to the admin dashboard

        else:
            return redirect(url_for('in_progress.in_progress'))  # Redirect if the page is not complete for their role

    return render_template('login.html')


@auth_bp.route('/', methods=['POST'])
def verify():
    """
     Checks the user's credentials and redirects or returns an error message.

     :return: Redirect to the dashboard according to the user's role.
     If the credentials are incorrect, it returns a JSON response with an error message and 401 status code.
     """
    username = request.json.get('username')
    password = request.json.get('password')

    user_data = verify_auth(username, password)

    if user_data:  # Saves user data in the session

        # Check the user's role
        if user_data[5] == 'Admin':
            session['user'] = user_data
            return redirect(url_for('dashboard.dashboard_admin'))  # Redirects to the admin dashboard

        else:
            return redirect(url_for('in_progress.in_progress'))  # Redirect if the page is not complete for their role

    # If the data is incorrect, it sends an error message
    return jsonify({'error_message': 'Nume de utilizator sau parola incorecta'}), 401


@auth_bp.route('/logout')
def logout():
    """
     Logs the user out and redirects to the login page.

     :return: Redirect to login page ('/').
     """

    session.pop('user', None)
    return redirect(url_for('auth.auth'))