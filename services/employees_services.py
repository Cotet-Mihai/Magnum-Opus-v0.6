from flask import jsonify
from services.core_services import create_connection
from datetime import datetime
from mysql.connector import Error as MySQLInterfaceError


def get_all_employees_by_role(role: str = None):
    """
    Retrieve all employees from the database based on their role.

    :param role: The role of the employees to be fetched from the database. If None, fetches all employees.
    :return: A list of tuples containing employee data if employees with the specified role exist.

    :raises ValueError: If no employees are found for the specified role.
    :raises Exception: For any other unexpected errors during the database operation.
    """
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        if role is None:
            sql_query = 'SELECT * FROM Magnum_OPUS.users'
            cursor.execute(sql_query)

        else:
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

def get_employee_by_id(employee_id: int):
    """
    Retrieve an employee from the database based on their ID.

    :param employee_id: The ID of the employee to be fetched from the database.
    :return: A tuple containing the employee data if an employee with the specified ID exists.

    :raises ValueError: If no employee is found for the specified ID.
    :raises Exception: For any other unexpected errors during the database operation.
    """
    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()


        sql_query = ('SELECT * FROM Magnum_OPUS.users WHERE ID = %s')
        cursor.execute(sql_query, (employee_id,))

        result = cursor.fetchone()

        if result:
            return result

        else:
            raise ValueError ('Result is empty')

    except ValueError as ve:
        print(f'Fail to find employee by ID: {ve}')

    except Exception as e:
        print(f'Get employee by id Error: {e}')

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

def create_password(first_name: str, last_name:str, employmeny_date:str, role:str):
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

def filter_users(filter_by: str, filter_role: str, search_bar: str = None):
    """
    Filters users from the database based on role, name, and sorting criteria.

    :param filter_by: Sorting criteria. Can be 'asc' (ascending by name), 'desc' (descending by name),
                      'date_asc' (ascending by date), or 'date_desc' (descending by date).
    :param filter_role: The role of the user to filter by. Example: 'admin', 'user', etc.
    :param search_bar: Optional search term for filtering by last name or first name.
                       If specified, it will search for users whose names contain this term.
    :return: A list of users filtered and sorted based on the specified criteria.
    :raises: Exception if an error occurs during database interaction.
    """

    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        sql_query = "SELECT * FROM Magnum_OPUS.users"
        conditions = []
        params = []

        if filter_role:
            conditions.append("role = %s")
            params.append(filter_role)

        if search_bar:
            # Filtrare după numele de familie și numele mic
            conditions.append("(last_name LIKE %s OR first_name LIKE %s)")
            search_pattern = f"%{search_bar}%"
            params.extend([search_pattern, search_pattern])

        if conditions:
            sql_query += " WHERE " + " AND ".join(conditions)

        cursor.execute(sql_query, tuple(params))
        result = cursor.fetchall()

        if filter_by:
            match filter_by:
                case 'asc':
                    result = sorted(result, key=lambda user: user[1])  # Presupunând că user[1] este numele de familie
                case 'desc':
                    result = sorted(result, key=lambda user: user[1], reverse=True)
                case 'date_asc':
                    result = sorted(result, key=lambda user: user[6])  # Presupunând că user[6] este data
                case 'date_desc':
                    result = sorted(result, key=lambda user: user[6], reverse=True)

        return result

    except Exception as e:
        print(f'Filter user Error: {e}')
        return jsonify({'message': 'Filtrarea nu a putut fi efectuată.', 'category': 'Error'})

    finally:
        if connection is not None and cursor is not None:
            cursor.close()
            connection.close()

def delete_user(user_id: int):
    """
    Deletes a user from the database.

    :param user_id: The ID of the user to be deleted.
    :return: A JSON object containing a success or error message, along with an HTTP status code.
    :raises ValueError: If the user with the specified ID does not exist in the database.
    :raises Exception: If an error occurs during the SQL query execution or database connection.
    """

    connection = None
    cursor = None

    try:
        connection = create_connection()
        cursor = connection.cursor()

        user = get_employee_by_id(user_id)

        if not user:
            raise ValueError(f'User with ID {user_id} does not exist.')

        sql_query = 'DELETE FROM Magnum_OPUS.users WHERE ID = %s'
        cursor.execute(sql_query, (user_id,))
        connection.commit()

        return jsonify({'message': f'Utilizatorul {user[1]} {user[2]} a fost sters cu succes!',
                        'category': 'Success'}), 200

    except ValueError as ve:
        return jsonify({'message': f'{ve}',
                        'category': 'Error'}), 404

    except Exception as e:
        return jsonify({'message': {e},
                        'category': 'Error'}), 500

    finally:
        if connection is not None and cursor is not None:
            cursor.close()
            connection.close()

def edit_user(new_data_user: dict):
    """
    Updates an existing user's details in the database based on provided data.

    :param new_data_user: A dictionary containing the user data to be updated.
                            Must include 'ID', and may include 'last_name', 'first_name',
                            'department', 'role', 'date', 'county', and 'phone'.
    :type new_data_user: dict
    :raises ValueError: If the user with the specified ID is not found.
    :return: A JSON response indicating the result of the operation, along with an HTTP status code.
    :rtype: tuple (flask.Response, int)

    The function constructs an SQL UPDATE query dynamically based on the fields that are provided
    in the new_data_user dictionary. If a field is empty or not provided, it is ignored.
    If the user is successfully updated, a success message is returned;
    otherwise, an error message is returned.
    """
    connection = None
    cursor = None

    print(new_data_user)

    try:
        connection = create_connection()
        cursor = connection.cursor()

        user = get_employee_by_id(new_data_user['ID'])

        if not user:
            raise ValueError('Utilizatorul nu a fost gasit.')

        sql_query = 'UPDATE Magnum_OPUS.users SET'
        updates = []
        params = []

        if new_data_user['last_name']:
            updates.append(' last_name = %s')
            params.append(new_data_user['last_name'])

        if new_data_user['first_name']:
            updates.append(' first_name = %s')
            params.append(new_data_user['first_name'])

        if new_data_user['department']:
            updates.append(' department = %s')
            params.append(new_data_user['department'])

        if new_data_user['role']:
            updates.append(' role = %s')
            params.append(new_data_user['role'])

        if new_data_user['date']:
            updates.append(' employment_date = %s')
            params.append(new_data_user['date'])

        if new_data_user['county']:
            updates.append(' county = %s')
            params.append(new_data_user['county'])

        if new_data_user['phone']:
            updates.append(' phone_number = %s')
            params.append(new_data_user['phone'])

        if updates:
            sql_query += ', '.join(updates)
            sql_query += ' WHERE ID = %s'
            params.append(new_data_user['ID'])

            cursor.execute(sql_query, params)
            connection.commit()

            return jsonify({'message': f'Utilizatorul cu ID-ul: {user[0]} a fost editat cu succes!',
                            'category': f'Success'}), 200

        else:
            return jsonify({'message': f'Nu a fost gasit nici un camp pentru a fii editat.',
                            'category': 'Info'}), 200

    except ValueError as ve:
        return jsonify({'message': f'{ve}',
                        'category': 'Error'}), 404

    except MySQLInterfaceError as db_err:
        return jsonify({'message': str(db_err),
                        'category': 'Error'}), 200

    except Exception as e:
        return jsonify({'message': f'{e}',
                        'category': 'Error'}), 500

    finally:
        if connection is not None and cursor is not None:
            cursor.close()
            connection.close()
