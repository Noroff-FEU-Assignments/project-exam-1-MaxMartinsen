// Form Manager

const validationRules = [
    {
        id: 'nameInput',
        labelId: 'nameLabel',
        test: value => value.length >= 5,
        errorMsg: "Name must be more than 5 characters",
        successMsg: "First Name"
    },
    {
        id: 'subjectInput',
        labelId: 'subjectLabel',
        test: value => value.length >= 15,
        errorMsg: "Subject should be more than 15 characters",
        successMsg: "Subject"
    },
    {
        id: 'emailInput',
        labelId: 'emailLabel',
        test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMsg: "Must be a valid email address",
        successMsg: "Email Address"
    },
    {
        id: 'messageInput',
        labelId: 'messageLabel',
        test: value => value.length >= 25,
        errorMsg: "Message should be more than 25 characters",
        successMsg: "Message content"
    }
];

// Form field interaction

function formInteraction() {
    document.querySelectorAll('.form__content input, .form__content textarea').forEach(element => {
        element.addEventListener('keyup', e => {
            let label = e.target.previousElementSibling;
            if (e.target.value === "") {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.add('active', 'highlight');
            }
        });

        element.addEventListener('blur', e => {
            let label = e.target.previousElementSibling;
            if (e.target.value === "") {
                label.classList.remove('active', 'highlight');
            } else {
                label.classList.remove('highlight');
            }
        });

        element.addEventListener('focus', e => {
            let label = e.target.previousElementSibling;
            if (e.target.value === "") {
                label.classList.remove('highlight');
            } else if (e.target.value !== "") {
                label.classList.add('highlight');
            }
        });
    });
}

// Tab navigation

function tabNavigation() {
    document.querySelectorAll('.tab a').forEach(element => {
        element.addEventListener('click', e => {
            e.preventDefault();

            e.target.parentNode.classList.add('active');
            Array.from(e.target.parentNode.parentNode.children).forEach(sibling => {
                if (sibling !== e.target.parentNode) {
                    sibling.classList.remove('active');
                }
            });

            let target = e.target.getAttribute('href');

            document.querySelectorAll('.form__inner > div').forEach(element => {
                if ('#' + element.id !== target) {
                    element.style.display = 'none';
                } else {
                    element.style.display = 'block';
                    element.style.opacity = 0;
                    setTimeout(() => {
                        element.style.transition = 'opacity 600ms';
                        element.style.opacity = 1;
                    }, 20);
                }
            });
        });
    });
}

// Form validation

function formValidation(validationRules) {
    validationRules.forEach(({id, labelId, test, errorMsg, successMsg}) => {
        const input = document.getElementById(id);
        const label = document.getElementById(labelId);

        input.addEventListener('keyup', e => {
            if (test(e.target.value)) {
                label.innerHTML = `${successMsg}<span class='req'>*</span>`;
                label.classList.remove('error');
            } else {
                label.innerHTML = `${errorMsg}<span class='req'>*</span>`;
                label.classList.add('error');
            }
        });
    });
}

// Form submission

function formSubmission(validationRules) {
    document.getElementById('submitBtn').addEventListener('click', async e => {
        e.preventDefault();

        let isValid = validationRules.every(({id, labelId, test, errorMsg, successMsg}) => {
            const input = document.getElementById(id);
            const label = document.getElementById(labelId);
            
            if (test(input.value)) {
                label.innerHTML = `${successMsg}<span class='req'>*</span>`;
                label.classList.remove('error');
                return true;
            } else {
                label.innerHTML = `${errorMsg}<span class='req'>*</span>`;
                label.classList.add('error');
                return false;
            }
        });

        if (isValid) {
            // Get the form values
            let name = document.getElementById('nameInput').value;
            let email = document.getElementById('emailInput').value;
            let subject = document.getElementById('subjectInput').value;
            let message = document.getElementById('messageInput').value;

            // Prepare the data to send
            let data = {
                'name': name,
                'email': email,
                'subject': subject,
                'message': message,
            };

            try {
                // Make the POST request to the WordPress API
                const response = await fetch(`https://carblog.maxmartinsen.pw/wp-json/contact/v1/send`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const jsonResponse = await response.json();

                console.log('Success:', jsonResponse);

                window.location.href = "#popup-gratitude";
            } catch (error) {
                console.error('Error:', error);
                window.location.href = "#popup-cancellation";
            }
        } else {
            window.location.href = "#popup-cancellation";
        }
    });
}


export { formInteraction, tabNavigation, formValidation, formSubmission, validationRules };
