from services.core_services import create_connection


def verify_auth(username: str, password: str):
    """
    :param username: The user's username
    :param password: The user's password
    :return: The user found in the database or None
    """
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        username = username.split()

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