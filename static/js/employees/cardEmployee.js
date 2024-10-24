export class CardEmployee {
    /**
     * Initializes a new instance of the CardEmployee class.
     *
     * @param {HTMLElement} filterBy - The filter element for employee attributes.
     * @param {HTMLElement} filterRole - The filter element for employee roles.
     * @param {HTMLElement} searchBar - The search input element for employee names.
     * @param {HTMLElement} employeesContainer - The container element where employee cards are displayed.
     * @param {Notification} notification - The notification handler for displaying messages.
     */
    constructor(filterBy, filterRole, searchBar, employeesContainer, notification) {
        this.filterBy = filterBy;
        this.filterRole = filterRole;
        this.searchBar = searchBar;
        this.employeesContainer = employeesContainer;
        this.notification = notification;

        this.filterEmployees();  // Call to filter employees upon initialization

        this.setupEventListeners();  // Set up event listeners for filtering
    }

    /**
     * Sets up event listeners for the filter elements and search bar.
     */
    setupEventListeners() {
        this.filterBy.addEventListener('change', this.filterEmployees.bind(this));
        this.filterRole.addEventListener('change', this.filterEmployees.bind(this));
        this.searchBar.addEventListener('input', this.filterEmployees.bind(this));
    }

    /**
     * Fetches filtered employees from the server and updates the employee container.
     */
    filterEmployees() {
        fetch('employees/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filterBy: this.filterBy.value,
                filterRole: this.filterRole.value,
                searchBar: this.searchBar.value
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                this.employeesContainer.innerHTML = html;  // Update the container with the filtered results
                this.setFullCard();
            })
            .catch(error => this.notification.showNotification('Error', error.message));  // Show error notification
    }

    /**
     * Initializes FullCardEmployee instances for each employee card in the container.
     */
    setFullCard() {
        this.employeeCard = this.employeesContainer.querySelectorAll('.full-card-employee');

        this.employeeCard.forEach(card => {
            new FullCardEmployee(card, this.notification, this.filterEmployees.bind(this));
        });
    }
}

class FullCardEmployee {
    /**
     * Initializes a new instance of the FullCardEmployee class.
     *
     * @param {HTMLElement} card - The employee card element.
     * @param {Notification} notification - The notification handler for displaying messages.
     * @param {Function} filter - The filter function to call after editing or deleting an employee.
     */
    constructor(card, notification, filter) {
        this.card = card;
        this.notification = notification;
        this.filter = filter;

        this.userID = this.card.dataset.userId;

        this.editContainer = card.querySelector('.edit-employee');

        this.editButton = card.querySelector('.card-edit-button');

        this.deleteButton = card.querySelector('.edit-delete');
        this.saveButton = card.querySelector('.edit-save');

        this.allInputs = card.querySelectorAll('.edit-input');

        this.department = card.querySelector('#edit-departmnet');
        this.role = card.querySelector('#edit-role');

        this.setupEventListeners();

        this.syncSelectOptionsBetweenDepartmentAndRole();
    }

    /**
     * Sets up event listeners for the edit, delete, and save buttons.
     */
    setupEventListeners() {
        this.editButton.addEventListener('click', () => this.updateFormSizeAndState());
        this.deleteButton.addEventListener('click', () => this.deleteEmployee());
        this.saveButton.addEventListener('click', () => this.editEmployee());
        this.department.addEventListener('change', () => this.syncSelectOptionsBetweenDepartmentAndRole());
    }

    /**
     * Enables the input fields and buttons for editing an employee.
     */
    enableElements() {
        this.allInputs.forEach(input => input.disabled = false);
        this.saveButton.disabled = false;
        this.deleteButton.disabled = false;
    }

    /**
     * Disables the input fields and buttons for editing an employee.
     */
    disableElements() {
        this.allInputs.forEach(input => input.disabled = true);
        this.saveButton.disabled = true;
        this.deleteButton.disabled = true;
    }

    syncSelectOptionsBetweenDepartmentAndRole() {
        const optionsIT = [
            { value: 'Manager', text: 'Manager' },
            { value: 'Suport', text: 'Suport' },
            { value: 'Tehnic', text: 'Tehnic'}
        ];

        const optionsOperational = [
            { value: 'Director Operational', text: 'Director Operational'},
            { value: 'Manager Regional', text: 'Manager Regional'},
            { value: 'Manager Zonal', text: 'Manager Zonal'},
            { value: 'Manager Local', text: 'Manager Local'},
            { value: 'Operator', text: 'Operator'}
        ]

        this.role.innerHTML = '';

        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Rol';
        placeholder.disabled = true;
        placeholder.selected = true;
        this.role.appendChild(placeholder);

        if (this.department.value === 'IT') {
            optionsIT.forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.text;
                this.role.appendChild(newOption);
            })
        } else if (this.department.value === 'Operational') {
            optionsOperational.forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.text;
                this.role.appendChild(newOption);
            })
        }
    }

    /**
     * Resets the values of the input fields in the employee edit form.
     */
    resetElementsValue() {
        this.allInputs.forEach(element => {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0; // Reset selection
            } else {
                element.value = ''; // Clear value for other inputs
            }
        });
        this.syncSelectOptionsBetweenDepartmentAndRole();
    }

    /**
     * Toggles the size and state of the edit container for the employee.
     */
    updateFormSizeAndState() {
        if (this.editContainer.style.width === '0px' || this.editContainer.style.width === '') {
            this.editContainer.style.width = '250px';
            this.enableElements();
        } else {
            this.editContainer.style.width = '0px';
            setTimeout(() => {
                this.disableElements();
                this.resetElementsValue();
            }, 600);
        }
    }

    /**
     * Deletes the employee after user confirmation and updates the employee list.
     */
    deleteEmployee() {
        const confirmation = confirm("Sigur vrei sa stergi acest utilizator ?");

        if (confirmation) {
            fetch('employees/delete', {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    userID: this.userID
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.notification.showNotification(data.category, data.message);
                    this.filter();
                })
                .catch(error => {
                    this.notification.showNotification('Error', error.message);
                });
        }
    }

    /**
     * Edits the employee details and updates the employee list after confirmation.
     */
    editEmployee() {
        const lastName = this.card.querySelector('#edit-last-name');
        const firstName = this.card.querySelector('#edit-first-name');
        const department = this.card.querySelector('#edit-departmnet');
        const role = this.card.querySelector('#edit-role');
        const date = this.card.querySelector('#edit-date');
        const county = this.card.querySelector('#edit-county');
        const phone = this.card.querySelector('#edit-phone');

        const confirmation = confirm("Sigur vrei sa editezi ?");

        if (confirmation) {
            fetch('employees/edit', {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    ID: this.userID,
                    lastName: lastName.value,
                    firstName: firstName.value,
                    department: department.value,
                    role: role.value,
                    date: date.value,
                    county: county.value,
                    phone: phone.value
                })
            })
            .then(respone => {
                if (!respone.ok) {
                    throw new Error('Network response was not ok');
                }
                return respone.json();
            })
                .then(data => {
                    this.notification.showNotification(data.category, data.message);
                    this.updateFormSizeAndState();
                    setTimeout(() => {
                        this.filter();
                    }, 700);
                })
                .catch(error => {
                    this.notification.showNotification('Error', error.message);
                });
        }
    }
}
