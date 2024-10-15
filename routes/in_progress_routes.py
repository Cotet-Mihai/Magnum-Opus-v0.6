from flask import Blueprint, session, redirect, url_for, render_template

in_progress_bp = Blueprint('in_progress', __name__)

@in_progress_bp.route('/in_progress')
def in_progress():
    """
    Renders a page indicating that the section is currently under development.

    :return: Returns the rendered in-progress template if the user is authenticated,
    or redirects to the authentication page if the user is not authenticated.
        """

    if 'user' in session:
        user = session['user']

        return render_template('in_progress.html', user=user[1])

    return redirect(url_for('auth.auth'))