from flask import Blueprint, session, redirect, url_for, render_template, request
from services.core_services import handle_dashboard_access
from services.employees_services import get_all_employees_by_role, create_password, add_new_employee, filter_users, \
    delete_user, edit_user, get_all_values_from_a_column

employees_bp = Blueprint('employees', __name__)


@employees_bp.route('/employees')
def employees_admin():
    if 'user' in session:

        user = session['user']

        number_of_employees_grouped_by_role = [len(get_all_employees_by_role('Admin')),
                                               len(get_all_employees_by_role('Suport')),
                                               len(get_all_employees_by_role('Tehnic')),
                                               len([employee for employee in get_all_employees_by_role() if employee[4] != 'IT'])]

        return handle_dashboard_access(user[5], render_template('employees.html',
                                                                active_page='employees',
                                                                user=user,
                                                                number_of_employees_grouped_by_role = number_of_employees_grouped_by_role,
                                                                departments=get_all_values_from_a_column('department'),
                                                                roles=get_all_values_from_a_column('role')
                                                                ))
    else:
        return redirect(url_for('auth.auth'))


@employees_bp.route('/employees/add', methods=['POST'])
def add_employee():
    new_employee_data = {'last_name': request.json.get('lastName'),
                         'first_name': request.json.get('firstName'),
                         'password': create_password(request.json.get('lastName'), request.json.get('firstName'), request.json.get('date'), request.json.get('role')),
                         'department': request.json.get('department'),
                         'role': request.json.get('role'),
                         'date': request.json.get('date'),
                         'county': request.json.get('county'),
                         'phone_number': request.json.get('phone'),
                         'its_active': request.json.get('itsActive')}

    return add_new_employee(new_employee_data)


@employees_bp.route('/employees/filter', methods=['POST'])
def filter_employees():
    filter_by = request.json.get('filterBy')
    filter_role = request.json.get('filterRole')
    filter_department = request.json.get('filterDepartment')
    search_bar = request.json.get('searchBar')

    employees_list = filter_users(filter_by, filter_role, filter_department, search_bar)

    return render_template('partials/employees_list.html', employees=employees_list)


@employees_bp.route('/employees/delete', methods=['DELETE'])
def delete_employee():
    user_id = request.json.get('userID')

    return delete_user(user_id)


@employees_bp.route('/employees/edit', methods=['PUT'])
def edit_employee():
    new_data_user = {
        'ID': request.json.get('ID'),
        'last_name': request.json.get('lastName'),
        'first_name': request.json.get('firstName'),
        'department': request.json.get('department'),
        'role': request.json.get('role'),
        'date': request.json.get('date'),
        'county': request.json.get('county'),
        'phone': request.json.get('phone')
    }

    print(new_data_user)

    return edit_user(new_data_user)