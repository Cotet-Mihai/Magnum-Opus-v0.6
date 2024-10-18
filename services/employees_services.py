from flask import jsonify
from services.core_services import create_connection
from datetime import datetime


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
    """
    Adds a new employee to the database.

    :param user_data: A dictionary containing user data with the following keys:
                      - last_name (str): The last name of the employee.
                      - first_name (str): The first name of the employee.
                      - password (str): The password for the employee.
                      - department (str): The department the employee belongs to.
                      - role (str): The role of the employee.
                      - employment_date (str): The employment date in format 'aaaa-mm-dd'.
                      - county (str): The county where the employee resides.
                      - phone_number (str): The phone number of the employee.

    :return: A JSON response containing a success message and HTTP status code 200 if the employee
             was added successfully; otherwise, returns an error message with HTTP status code 400.

    :raises Exception: If there is an error during the database operation, an exception is raised
                      and logged, and a relevant error message is returned.
    """
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

def create_password(first_name, last_name, employmeny_date, role):
    """
    Generates a password based on the employee's first name, last name, employment date, and role.

    The password is structured as follows:
    - The first two letters of the first name (lowercase).
    - The day of the employment date.
    - The month of the employment date.
    - The first two letters of the last name (uppercase).
    - A special character based on the role.

    :param first_name: The first name of the employee (str).
    :param last_name: The last name of the employee (str).
    :param employmeny_date: The employment date in the format 'aaaa-mm-dd' (str).
    :param role: The role of the employee (str), which determines the special character in the password.

    :return: A generated password (str) based on the provided parameters.

    :raises ValueError: If the employment date is not in the expected format.
        """

    part1 = first_name[:2].lower()
    part2 = last_name[:2].upper()

    day = datetime.strptime(employmeny_date, '%Y-%m-%d').day
    month = datetime.strptime(employmeny_date, '%Y-%m-%d').month

    symbol = None
    match role:
        case 'Admin':
            symbol = '!'
        case 'Suport':
            symbol = '#'
        case 'Tehnic':
            symbol = '@'

    return f'{part1}{day}{month}{part2}{symbol}'