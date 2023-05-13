// contact
// Form field interaction
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

// Tab navigation
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

// Form validation
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

// Form submission
document.getElementById('submitBtn').addEventListener('click', e => {
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
        window.location.href = "#popup-gratitude";
    } else {
        window.location.href = "#popup-cancellation";
    }
});

