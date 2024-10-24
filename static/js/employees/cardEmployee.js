export class CardEmployee {

    constructor(filterBy, filterRole, searchBar, employeesContainer, notification) {
        this.filterBy = filterBy;
        this.filterRole = filterRole;
        this.searchBar = searchBar;
        this.employeesContainer = employeesContainer;
        this.notification = notification;

        this.filterEmployees();  // Call to filter employees upon initialization

        this.setupEventListeners();  // Set up event listeners for filtering
    }

    setupEventListeners() {
        this.filterBy.addEventListener('change', this.filterEmployees.bind(this));
        this.filterRole.addEventListener('change', this.filterEmployees.bind(this));
        this.searchBar.addEventListener('input', this.filterEmployees.bind(this));
    }


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

    setFullCard() {
        this.employeeCard = this.employeesContainer.querySelectorAll('.full-card-employee');

        this.employeeCard.forEach(card => {
            new FullCardEmployee(card, this.notification, this.filterEmployees.bind(this));
        })
    }
}

class FullCardEmployee {
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

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.editButton.addEventListener('click', () => this.updateFormSizeAndState());
        this.deleteButton.addEventListener('click', () => this.deleteEmployee());
        this.saveButton.addEventListener('click', () => this.editEmployee());
    }

    enableElements() {
        this.allInputs.forEach(input => input.disabled = false);
        this.saveButton.disabled = false;
        this.deleteButton.disabled = false;
    }

    disableElements() {
        this.allInputs.forEach(input => input.disabled = true);
        this.saveButton.disabled = true;
        this.deleteButton.disabled = true;
    }

    resetElementsValue() {
        this.allInputs.forEach(element => {
            if (element.tagName === 'SELECT') {
                element.selectedIndex = 0; // Reset selection
            } else {
                element.value = ''; // Clear value for other inputs
            }
        });
    }

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

    deleteEmployee() {
        const confirmation = confirm("Sigur vrei sa stergi acest utilizator ?")

        if (confirmation) {
            fetch('employees/delete', {
                method: 'DELETE',
                headers: {'Content-type' : 'application/json'},
                body: JSON.stringify({
                    userID: this.userID
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json();
                })
                .then(data => {
                    this.notification.showNotification(data.category, data.message);
                    this.filter();
                })
                .catch(error => {
                    this.notification.showNotification('Error', error.message)
                })
        }
    }

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
                headers: {'Content-type': 'application/json'},
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
                    throw new Error('Network response was not ok')
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
                    this.notification.showNotification('Error', error.message)
                })
        }
    }

}
