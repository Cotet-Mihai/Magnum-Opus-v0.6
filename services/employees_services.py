from flask import jsonify

from services.core_services import create_connection


def get_all_employees_by_role(role: str):
    """
    Retrieve all employees from the database based on their role.

    :param role: The role of the employees to be fetched from the database.
    :return: A list of tuples containing employee data if employees with the specified role exist.

    :raises ValueError: If no employees are found for the specified role.
    :raises Exception: For any other unexpected errors during the database operation.
    """
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        sql_query = 'SELECT * FROM Magnum_OPUS.users WHERE role = %s'
        cursor.execute(sql_query, (role,))

        result = cursor.fetchall()

        if result:
            return result

        else:
            raise ValueError(f'Result is empty')

    except ValueError as ve:
        print(f'Failed to fetch employees for role: {ve}')

    except Exception as e:
        print(f'Exception: {e}')

    finally:
        if connection is not None and cursor is not None:
            cursor.close()
            connection.close()

def add_new_employee(user_data: dict):
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        sql_query = ('INSERT INTO Magnum_OPUS.users (last_name, first_name, password, department, role, employment_date, county, phone_number) '
                     'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)')

        values = (user_data["last_name"],
                  user_data["first_name"],
                  user_data["password"],
                  user_data["department"],
                  user_data["role"],
                  user_data["employment_date"],
                  user_data["county"],
                  user_data["phone_number"])

        cursor.execute(sql_query, values)

        connection.commit()

        return jsonify({'message': f"{user_data["last_name"]} {user_data["first_name"]} a fost adăugat cu succes!",
                        'category': 'Success'}), 200

    except Exception as e:
        print(f'Add New Employee Error: {e}')

        return jsonify({'message': 'Utilizatorul nu a putut să fie adăugat.',
                        'category': 'Error'}), 400

    finally:
        if cursor is not None and connection is not None:
            cursor.close()
            connection.close()

def create_password():
    return 'parolaaa112233'
