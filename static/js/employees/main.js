import { EmployeeFormController } from "./addEmployee.js";
import { Notification } from "./notification.js";
import { CardEmployee } from "./cardEmployee.js";


// DOM elements for notification
const notificationDiv = document.getElementById('notification-container');  // The notification div
const notificationMessage = document.getElementById('notification-message');  // Paragraph in the notification div

// Initialize the Notification instance
const notification = new Notification(notificationDiv, notificationMessage);

// DOM elements for filtering and searching employees
const filterBy = document.getElementById('filter-by');  // Filter by
const filterRole = document.getElementById('filter-role');  // Filter role
const filterDepartment = document.getElementById('filter-department');  // Filter role
const searchBar = document.getElementById('search-employee');  // Search bar
const employeesContainer = document.getElementById('employees-container');  // Employees Container

// Initialize the CardEmployee instance for managing employee cards
const cardEmployees = new CardEmployee(filterBy, filterRole, filterDepartment, searchBar, employeesContainer, notification);

// DOM elements for the employee form
const AddEmployeeFormButton = document.getElementById('add-employee-button');  // The button that displays the form
const addEmployeeForm = document.getElementById('add-employeed-form');  // Form

// Initialize the EmployeeFormController instance to manage the employee form
new EmployeeFormController(AddEmployeeFormButton, addEmployeeForm, notification, cardEmployees);