// 1. GET ELEMENTS  -------------------------------------------------------------------------

// 1.1 Show add employee form elements
const showAddEmployeeFormButton = document.getElementById('add-employee-button');
const addEmployeeForm = document.getElementById('add-employeed-form');
const allAddEmployeeFormElements = addEmployeeForm.querySelectorAll('input, select, textarea, button')
const addEmployeeFormInputDate = document.getElementById('add-employee-form-date');

// 1.2 Add employee
const addEmployeeFormFirstNameInput = document.getElementById('add-employee-form-first-name');
const addEmployeeFormLastNameInput = document.getElementById('add-employee-form-last-name');
const addEmployeeFormDepartmentInput = document.getElementById('add-employee-form-department');
const addEmployeeFormRoleInput = document.getElementById('add-employee-form-role');
const addEmployeeFormCountyInput = document.getElementById('add-employee-form-county');
const addEmployeeFormPhoneInput = document.getElementById('add-employee-form-phone');
const addEmployeeFormSubmitButton = document.getElementById('submit-add-employee-button');

// 1.3 Notification
const notification = document.getElementById('notification-container');
const notificationMessage = document.getElementById('notification-message');

// 1.4 Filter bar
const filterBy = document.getElementById('filter-by');
const filterRole = document.getElementById('filter-role');
const searchBar = document.getElementById('search-employee');
const employeesContaioner = document.getElementById('employees-container');

// 2. EVENT LISTENERS  ----------------------------------------------------------------------

// 2.1 Change height of the add employee form
showAddEmployeeFormButton.addEventListener('click', changeHeightAddEmployeeForm);
addEmployeeFormSubmitButton.addEventListener('submit', addNewEmployee);
document.querySelectorAll('.filter').forEach(select => {select.addEventListener('change', filterEmployees);})
searchBar.addEventListener('input', filterEmployees);

// 3. OTHERS  -------------------------------------------------------------------------------

// 3.1 Set date to curent date
addEmployeeFormInputDate.value = new Date().toISOString().split('T')[0];

// 4. FUNCTIONS  ----------------------------------------------------------------------------

// 4.1 Show Notification
function showNotification(category, message){
    let backgroundColor;

    switch (category) {
        case 'Success':
            backgroundColor = 'var(--green-level-1)';
            break;
        case 'Error':
            backgroundColor = 'var(--red-level-3)';
            break;
        case 'Info':
            backgroundColor = 'var(--yellow-level-0)';
            break;
    }

    notification.style.background = backgroundColor;
    notificationMessage.innerText = message;

    notification.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
        notification.style.transform = 'translate(-50%, -200%)';
    }, 3000);
}

// 4.2 Change height of the add employee form
function changeHeightAddEmployeeForm() {
    if (addEmployeeForm.style.height === '' || addEmployeeForm.style.height === '0px') {
        addEmployeeForm.style.height = '100px';  // Expand the form
        allAddEmployeeFormElements.forEach(element => element.disabled = false);  // Enable all elements
    } else {
        addEmployeeForm.style.height = '0px';  // Collapse the form
        setTimeout(() => {
            allAddEmployeeFormElements.forEach(element => element.disabled = true);  // Disable all elements
        }, 500);
        deleteElementsValue();  // Clear form elements after collapsing
    }
}

// 4.3 Clear form inputs
function deleteElementsValue() {
    setTimeout(() => {
        allAddEmployeeFormElements.forEach(element => {
            if (element.type !== 'button') {
                element.value = '';  // Clear element value
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0;  // Reset selects
                }
                if (element.type === 'date') {
                    element.value = new Date().toISOString().split('T')[0];  // Reset date to the current date
                }
            }
        });
    }, 500);
}

// 4.4 Add new employee
function addNewEmployee(event){
    event.preventDefault(); //Prevent the form from submitting normaly

    // get all values
    const firstName = addEmployeeFormFirstNameInput.value;
    const lastName = addEmployeeFormLastNameInput.value;
    const department = addEmployeeFormDepartmentInput.value;
    const role = addEmployeeFormRoleInput.value;
    const employmentDate = addEmployeeFormInputDate.value;
    const county = addEmployeeFormCountyInput.value;
    const phone = addEmployeeFormPhoneInput.value;

    fetch('/employees/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicates the type of content being sent
        },
        body: JSON.stringify({ firstName: firstName,
        lastName: lastName,
        department: department,
        role: role,
        employmentDate: employmentDate,
        county: county,
        phone: phone}) // Converts the data to JSON format
    })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        })
        .then(data => {
            if (data.category === 'Success'){
                showNotification(data.category, data.message);
                changeHeightAddEmployeeForm();
                filterEmployees();
            }
            else if (data.category === 'Error'){
                throw new Error(data.message)
            }
        })
        .catch(error => {
            showNotification('Error' ,error.message)
        })
}

// 4.5 Filter Employees
function filterEmployees() {

    const filterByValue = filterBy.value;
    const filterRoleValue = filterRole.value;
    const searchBarValue = searchBar.value;

    fetch('/employees/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicates the type of content being sent
        },
        body: JSON.stringify({
            filterBy: filterByValue,
            filterRole: filterRoleValue,
            searchBar: searchBarValue
        })
    })
        .then(response => {
            if (!response.ok){
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            employeesContaioner.innerHTML = html;
        })
        .catch(error => showNotification('Error', error.message))
}