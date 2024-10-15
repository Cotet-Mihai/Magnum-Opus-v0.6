document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(function(response) {
        if (response.redirected) {
            // Dacă serverul redirecționează, mergi la noua adresă
            window.location.href = response.url;
        } else {
            return response.json()
                .then(errorData => {
                throw new Error(errorData.error_message); // Aruncă eroarea pentru a fi prinsă mai jos
            });
        }
    })
    .catch(
        error => document.getElementById('error-message').innerText = error.message
    );
});
