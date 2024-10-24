export class Notification {
    /**
     * Initializes a new instance of the Notification class.
     *
     * @param {HTMLElement} notification - The HTML element that will display the notification.
     * @param {HTMLElement} message - The HTML element that will display the message content.
     */
    constructor(notification, message) {
        this.notification = notification;
        this.message = message;
    }

    /**
     * Displays a notification with a specific background color based on the category.
     *
     * @param {string} category - The category of the notification, which determines its background color.
     *                           Can be 'Success', 'Error', or 'Info'.
     * @param {string} message - The message to display in the notification.
     * @returns {void} - This function does not return a value.
     */
    showNotification(category, message) {
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

        this.notification.style.background = backgroundColor;
        this.message.innerText = message;

        this.changeHeight();
    }

    /**
     * Changes the height of the notification element for a smooth transition effect.
     *
     * This method applies a transformation to the notification element to move it into view.
     * After a timeout of 3000ms, the notification is moved out of view.
     *
     * @returns {void} - This function does not return a value.
     */
    changeHeight() {
        this.notification.style.transform = 'translate(-50%, -50%)';

        setTimeout(() => this.notification.style.transform = 'translate(-50%, -200%)', 3000);
    }
}