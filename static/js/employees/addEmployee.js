export class EmployeeFormController {
    /**
     * Initializes a new instance of the AddEmployee class.
     *
     * @param {HTMLElement} button - The button that displays the form.
     * @param {HTMLElement} form - The form element containing the input fields.
     * @param {Notification} notification - Notification function.
     * @param {CardEmployee} cardEmployee - Control for card-employee.
     */
    constructor(button, form, notification, cardEmployee) {

        this.button = button;
        this.form = form;
        this.notification = notification
        this.cardEmployee = cardEmployee

        this.formElements = form.querySelectorAll('input, select, textarea, button');

        this.firstName = form.querySelector('#add-employee-form-first-name');
        this.lastName = form.querySelector('#add-employee-form-last-name');
        this.department = form.querySelector('#add-employee-form-department');
        this.role = form.querySelector('#add-employee-form-role');
        this.date = form.querySelector('#add-employee-form-date');
        this.county = form.querySelector('#add-employee-form-county');
        this.phone = form.querySelector('#add-employee-form-phone');

        this.setCurrentDate();  // Set current date for inputDate
        this.disableElements();  // Disable all form elements

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.button.addEventListener('click', () => this.updateFormSizeAndState());
        this.form.addEventListener('submit', (event) => this.addNewEmployee(event));
    }

    /**
     * Sets the current date in the input of type date.
     */
    setCurrentDate() {
        this.date.value = new Date().toISOString().split('T')[0];
    }

    /**
     * Disables all input elements within the form.
     */
    disableElements() {
        this.formElements.forEach(element => element.disabled = true);
    }

    /**
     * Enables all input elements within the form.
     */
    enableElements() {
        this.formElements.forEach(element => element.disabled = false);
    }

    /**
     * Resets the values of form elements to their default state.
     * - For SELECT elements, it resets to the first option.
     * - For input of type date, it sets the current date.
     * - For other input types, it clears the value.
     */
    resetElementsValue() {
        this.formElements.forEach(element => {
            if (element.type !== 'button') {
                if (element.tagName === 'SELECT') {
                    element.selectedIndex = 0; // Reset selection
                } else if (element.type === 'date') {
                    this.setCurrentDate(); // Set current date for date input
                } else {
                    element.value = ''; // Clear value for other inputs
                }
            }
        });
    }

    /**
     * Updates the height of the form and toggles the state of its elements.
     *
     * If the current height of the form is empty or '0px', it sets the height to
     * '100px' and enables the form elements. If the height is anything else,
     * it collapses the form to '0px', disables the form elements after a
     * brief delay, and resets their values to the default state.
     */
    updateFormSizeAndState() {
        if (this.form.style.height === '' || this.form.style.height === '0px') {
            this.form.style.height = '100px';
            this.enableElements(); // Enable the form elements when expanded
        } else {
            this.form.style.height = '0px';
            setTimeout(() => {
                this.disableElements();  // Disable elements
                this.resetElementsValue(); // Reset values of the form elements
            }, 500);

        }
}

    /**
     * Adds a new employee by sending a POST request to the server.
     *
     * @param {Event} event - The event object representing the form submission.
     * @returns {void} - This function does not return a value.
     *
     * @throws {Error} - Throws an error if the network response is not ok or if the server
     *                  returns an error message.
     */
    addNewEmployee(event) {
        event.preventDefault();  // Prevent the form from submitting normaly

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
                phone: this.phone.value
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