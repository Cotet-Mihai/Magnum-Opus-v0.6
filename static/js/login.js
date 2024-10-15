document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Retrieves the username and password values from the input fields
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    // Sends a POST request to the server with the user's credentials
    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indicates the type of content being sent
        },
        body: JSON.stringify({ username: username, password: password }) // Converts the data to JSON format
    })
    .then(function(response) {
        // Checks if the server redirected the request (e.g., successful login)
        if (response.redirected) {
            // If redirected, navigates to the new URL
            window.location.href = response.url;
        } else {
            // If not redirected, tries to extract the error message from the response
            return response.json()
                .then(errorData => {
                    throw new Error(errorData.error_message); // Throws an error to be caught later
                });
        }
    })
    .catch(
        error => document.getElementById('error-message').innerText = error.message // Displays the error message
    );
});
