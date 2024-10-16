from services.core_services import create_connection


def verify_auth(username: str, password: str):
    """
    Verifies user credentials against the database.

    :param username: The user's full name, expected as 'LastName FirstName'.
    :param password: The user's password.

    :return: Returns the user record found in the database as a tuple if the credentials are valid,
    or None if the credentials are invalid or an error occurs.
    """
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        username = username.lower().split()
        print(username)

        sql_query = "SELECT * FROM Magnum_OPUS.users WHERE last_name = %s AND first_name = %s AND password = %s"
        cursor.execute(sql_query, (username[0], username[1], password))

        result = cursor.fetchone()

        if result:
            return result

        else:
            return None

    except Exception as e:
        print(f'Verify Auth ERROR: {e}')

    finally:
        if cursor is not None and connection is not None:
            cursor.close()
            connection.close()