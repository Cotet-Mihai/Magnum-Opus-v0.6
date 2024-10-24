/**
 * Class representing an employee card management system.
 */
export class CardEmployee {
    /**
     * Create a CardEmployee instance.
     * @param {HTMLSelectElement} filterBy - Element for filtering by general criteria.
     * @param {HTMLSelectElement} filterRole - Element for filtering by employee role.
     * @param {HTMLSelectElement} filterDepartment - Element for filtering by department.
     * @param {HTMLInputElement} searchBar - Input field for searching employees.
     * @param {HTMLElement} employeesContainer - Container element for displaying employee cards.
     * @param {Notification} notification - Notification system to display messages to the user.
     */
    constructor(filterBy, filterRole, filterDepartment, searchBar, employeesContainer, notification) {
        this.filterBy = filterBy;
        this.filterRole = filterRole;
        this.filterDepartment = filterDepartment;
        this.searchBar = searchBar;
        this.employeesContainer = employeesContainer;
        this.notification = notification;

        this.filterEmployees();

        this.syncSelectOptionsBetweenDepartmentAndRole();

        this.setupEventListeners();
    }

    /**
     * Set up event listeners for filter elements and search bar.
     */
    setupEventListeners() {
        this.filterBy.addEventListener('change', this.filterEmployees.bind(this));
        this.filterRole.addEventListener('change', this.filterEmployees.bind(this));
        this.filterDepartment.addEventListener('change', () => {
            this.syncSelectOptionsBetweenDepartmentAndRole();
            this.filterEmployees();
        });
        this.searchBar.addEventListener('input', this.filterEmployees.bind(this));
    }

    /**
     * Synchronize select options between department and role based on selected department.
     */
    syncSelectOptionsBetweenDepartmentAndRole() {
        const options = {
            IT: [
                { value: '', text: 'Toate rolurile'},
                { value: 'Manager IT', text: 'Manager IT' },
                { value: 'Suport', text: 'Suport' },
                { value: 'Tehnic', text: 'Tehnic' }
            ],
            Operational: [
                { value: '', text: 'Toate rolurile'},
                { value: 'Director Operational', text: 'Director Operational' },
                { value: 'Manager Regional', text: 'Manager Regional' },
                { value: 'Manager Zonal', text: 'Manager Zonal' },
                { value: 'Manager Local', text: 'Manager Local' },
                { value: 'Operator', text: 'Operator' }
            ],
            Toate_Departamentele: [
                { value: '', text: 'Toate rolurile'},
                { value: 'Manager IT', text: 'Manager IT' },
                { value: 'Suport', text: 'Suport' },
                { value: 'Tehnic', text: 'Tehnic' },
                { value: 'Director Operational', text: 'Director Operational' },
                { value: 'Manager Regional', text: 'Manager Regional' },
                { value: 'Manager Zonal', text: 'Manager Zonal' },
                { value: 'Manager Local', text: 'Manager Local' },
                { value: 'Operator', text: 'Operator' }
            ]
        };

        console.log(this.filterDepartment.value)

        if (!this.filterDepartment.value) {
            this.populateSelectOptions(this.filterRole, options['Toate_Departamentele']);
        } else {
            this.populateSelectOptions(this.filterRole, options[this.filterDepartment.value] || []);
        }
    }

    /**
     * Populate a select element with the provided options.
     * @param {HTMLSelectElement} selectElement - The select element to populate.
     * @param {Array<Object>} options - Array of option objects to populate the select with.
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
     * Filter employees based on selected criteria and search input.
     */
    filterEmployees() {
        fetch('employees/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filterBy: this.filterBy.value,
                filterRole: this.filterRole.value,
                filterDepartment: this.filterDepartment.value,
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
     * Set up full employee cards based on the filtered results.
     */
    setFullCard() {
        this.employeeCard = this.employeesContainer.querySelectorAll('.full-card-employee');

        this.employeeCard.forEach(card => {
            new FullCardEmployee(card, this.notification, this.filterEmployees.bind(this));
        });
    }
}

/**
 * Class representing an employee's full card with editing capabilities.
 */
class FullCardEmployee {
    /**
     * Create a FullCardEmployee instance.
     * @param {HTMLElement} card - The card element representing an employee.
     * @param {Notification} notification - Notification system to display messages to the user.
     * @param {Function} filter - Function to filter employees after actions like editing or deleting.
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
     * Set up event listeners for the card's buttons and inputs.
     */
    setupEventListeners() {
        this.editButton.addEventListener('click', () => this.updateFormSizeAndState());
        this.deleteButton.addEventListener('click', () => this.deleteEmployee());
        this.saveButton.addEventListener('click', () => this.editEmployee());
        this.department.addEventListener('change', () => this.syncSelectOptionsBetweenDepartmentAndRole());
    }

    /**
     * Enable input elements in the editing container.
     */
    enableElements() {
        this.allInputs.forEach(input => input.disabled = false);
        this.saveButton.disabled = false;
        this.deleteButton.disabled = false;
    }

    /**
     * Disable input elements in the editing container.
     */
    disableElements() {
        this.allInputs.forEach(input => input.disabled = true);
        this.saveButton.disabled = true;
        this.deleteButton.disabled = true;
    }

    /**
     * Sync role options based on the selected department.
     */
    syncSelectOptionsBetweenDepartmentAndRole() {
        const optionsIT = [
            { value: 'Manager IT', text: 'Manager IT' },
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
     * Reset the values of input elements in the editing container.
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
     * Update the size and state of the edit container.
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
     * Delete the employee associated with this card.
     * Prompts for confirmation before proceeding with deletion.
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
     * Edit the employee details based on the input values in the card.
     * Prompts for confirmation before proceeding with the edit.
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
