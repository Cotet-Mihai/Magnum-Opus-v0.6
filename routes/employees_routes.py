from flask import Blueprint, session, redirect, url_for, render_template, request
from services.core_services import handle_dashboard_access
from services.employees_services import get_all_employees_by_role, create_password, add_new_employee

employees_bp = Blueprint('employees', __name__)




@employees_bp.route('/employees')
def employees_admin():
    if 'user' in session:

        user = session['user']

        number_of_employees_grouped_by_role = [len(get_all_employees_by_role('Admin')),
                                               len(get_all_employees_by_role('Suport')),
                                               len(get_all_employees_by_role('Tehnic'))]

        return handle_dashboard_access(user[5], render_template('employees.html',
                                                                active_page='employees',
                                                                user=user,
                                                                number_of_employees_grouped_by_role = number_of_employees_grouped_by_role,
                                                                ))
    else:
        return redirect(url_for('auth.auth'))

@employees_bp.route('/employees', methods=['POST'])
def add_employee():
    new_employee_data = {'last_name': request.json.get('lastName'),
                         'first_name': request.json.get('firstName'),
                         'password': create_password(),
                         'department': request.json.get('department'),
                         'role': 'role',
                         'employment_date': request.json.get('employmentDate'),
                         'county': request.json.get('county'),
                         'phone_number': request.json.get('phoneNumber')}

    return add_new_employee(new_employee_data)