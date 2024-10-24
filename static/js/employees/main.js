import { EmployeeFormController } from "./addEmployee.js";
import { Notification } from "./notification.js";
import { CardEmployee } from "./cardEmployee.js";


const notificationDiv = document.getElementById('notification-container');  // The notification div
const notificationMessage = document.getElementById('notification-message');  // Paragraph in the notification div

const notification = new Notification(notificationDiv, notificationMessage);

const filterBy = document.getElementById('filter-by');  // Filter by
const filterRole = document.getElementById('filter-role');  // Filter role
const searchBar = document.getElementById('search-employee');  // Search bar
const employeesContainer = document.getElementById('employees-container');  // Employees Container

const cardEmployees = new CardEmployee(filterBy, filterRole, searchBar, employeesContainer, notification);

const AddEmployeeFormButton = document.getElementById('add-employee-button');  // The button that displays the form
const addEmployeeForm = document.getElementById('add-employeed-form');  // Form

const employeeFormController = new EmployeeFormController(AddEmployeeFormButton, addEmployeeForm, notification, cardEmployees);