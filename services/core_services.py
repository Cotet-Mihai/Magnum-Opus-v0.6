import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from flask import session, redirect, url_for


load_dotenv()  # Load environment variables from the .env file

secret_key = os.getenv('SECRET_KEY')

def create_connection():
    """
    Establishes a connection to the MySQL database using credentials from environment variables.

    :return: A connection object to the MySQL database if successful, otherwise None.

    :raises Error: Raises an exception if the connection fails with an error message.
    """

    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_DB')
        )

        return connection

    except Error as e:
        print(f'MySQL ERROR: {e}')


def handle_dashboard_access(role: str, template):
    """
    Checks if the current user's role matches the required role for accessing a specific template.

    :param role: The role of the user that is required to access the dashboard.

    :param template: The template that the user is trying to access.

    :return: Returns the template if the user has the required role.
    Otherwise, redirects to the in-progress page if the user exists in the session.

    :raises KeyError: Raises an exception if 'user' is not found in session.
    """
    if session['user'][5] == role:  # Check if user is in session and have role admin

        return template

    else:  # If the user does not exist or does not have an admin role

        if 'user' in session:  # Check if user exist in session
            return redirect(url_for('in_progress.in_progress'))