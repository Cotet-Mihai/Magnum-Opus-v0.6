import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from flask import session, redirect, url_for


load_dotenv()  # Load environment variables from the .env file

secret_key = os.getenv('SECRET_KEY')

def create_connection():
    """
    :return: Return connection string to database
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
    :param role: The role of the user in the session
    :param template: The template the user needs to reach
    """
    if session['user'][5] == role:  # Check if user is in session and have role admin

        return template

    else:  # If the user does not exist or does not have an admin role

        if 'user' in session:  # Check if user exist in session
            return redirect(url_for('in_progress.in_progress'))