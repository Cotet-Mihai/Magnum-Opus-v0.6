/**
 * Class representing a controller for the employee form.
 */
export class EmployeeFormController {

    /**
     * Create an instance of EmployeeFormController.
     * @param {HTMLElement} button - The button to toggle the form's visibility.
     * @param {HTMLFormElement} form - The form for adding new employees.
     * @param {Notification} notification - Notification system to display messages to the user.
     * @param {CardEmployee} cardEmployee - The cardEmployee instance for managing employee cards.
     */
    constructor(button, form, notification, cardEmployee) {
        this.button = button;
        this.form = form;
        this.notification = notification;
        this.cardEmployee = cardEmployee;

        this.formElements = this.form.querySelectorAll('input, select, textarea, button');

        this.firstName = this.form.querySelector('#add-employee-form-first-name');
        this.lastName = this.form.querySelector('#add-employee-form-last-name');
        this.department = this.form.querySelector('#add-employee-form-department');
        this.role = this.form.querySelector('#add-employee-form-role');
        this.date = this.form.querySelector('#add-employee-form-date');
        this.county = this.form.querySelector('#add-employee-form-county');
        this.phone = this.form.querySelector('#add-employee-form-phone');

        this.setCurrentDate();
        this.disableElements();

        this.syncSelectOptionsBetweenDepartmentAndRole();

        this.setupEventListeners();
    }

    /**
     * Set up event listeners for form interactions.
     */
    setupEventListeners() {
        this.button.addEventListener('click', () => this.updateFormSizeAndState());
        this.form.addEventListener('submit', (event) => this.addNewEmployee(event));
        this.department.addEventListener('change', () => this.syncSelectOptionsBetweenDepartmentAndRole());
    }

    /**
     * Set the current date in the date input field.
     */
    setCurrentDate() {
        this.date.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Disable all form elements.
     */
    disableElements() {
        this.formElements.forEach(element => element.disabled = true);
    }

    /**
     * Enable all form elements.
     */
    enableElements() {
        this.formElements.forEach(element => element.disabled = false);
    }

    /**
     * Reset the values of all form elements to their default state.
     */
    resetElementsValue() {
        this.formElements.forEach(element => {
            if (element.type !== 'button') {
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0;
                } else if (element.type === 'date') {
                    this.setCurrentDate();
                } else {
                    element.value = '';
                }
            }
        });
        this.syncSelectOptionsBetweenDepartmentAndRole();
    }

    /**
     * Synchronize the role select options based on the selected department.
     */
    syncSelectOptionsBetweenDepartmentAndRole() {
        const options = {
            IT: [
                { value: 'Manager IT', text: 'Manager IT' },
                { value: 'Suport', text: 'Suport' },
                { value: 'Tehnic', text: 'Tehnic' }
            ],
            Operational: [
                { value: 'Director Operational', text: 'Director Operational' },
                { value: 'Manager Regional', text: 'Manager Regional' },
                { value: 'Manager Zonal', text: 'Manager Zonal' },
                { value: 'Manager Local', text: 'Manager Local' },
                { value: 'Operator', text: 'Operator' }
            ]
        };

        this.populateSelectOptions(this.role, options[this.department.value] || []);
    }

    /**
     * Populate the options for a select element.
     * @param {HTMLSelectElement} selectElement - The select element to populate.
     * @param {Object[]} options - The options to populate the select element with.
     */
    populateSelectOptions(selectElement, options) {
        selectElement.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Rol';
        placeholder.disabled = true;
        placeholder.selected = true;
        selectElement.appendChild(placeholder);

        options.forEach(option => {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.text;
            selectElement.appendChild(newOption);
        });
    }

    /**
     * Update the size and state of the form based on its current state.
     */
    updateFormSizeAndState() {
        if (this.form.style.height === '' || this.form.style.height === '0px') {
            this.form.style.height = '100px';
            this.enableElements();
        } else {
            this.form.style.height = '0px';
            setTimeout(() => {
                this.disableElements();
                this.resetElementsValue();
            }, 500);
        }
    }

    /**
     * Handle the submission of the form to add a new employee.
     * @param {Event} event - The form submit event.
     */
    addNewEmployee(event) {
        event.preventDefault();

        const userResponse = confirm(
            "ATENTIE!\n Aceasta optiune nu poate fii modificata mai tarziu\n\n" +
            "Dorești să activezi acest cont?\n\n" +
            "Apasă OK pentru a activa contul.\n" +
            "Apasă Cancel pentru a-l adăuga ca informație fără cont."
        );

        fetch('employees/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                department: this.department.value,
                role: this.role.value,
                date: this.date.value,
                county: this.county.value,
                phone: this.phone.value,
                itsActive: userResponse ? 1 : 0
            })
        })
            .then(response => {
                if (!response.ok){
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then(data => {
                if (data.category === 'Success') {
                    this.notification.showNotification(data.category, data.message);
                    this.updateFormSizeAndState();
                    this.cardEmployee.filterEmployees();
                } else if (data.category === 'Error'){
                    throw new Error(data.message);
                }
            })
            .catch(error => console.log(error.message))
    }
}
