const logInForm = document.querySelector('form');


const url = ( window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://node-rest-course.herokuapp.com/api/auth/';

logInForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = {};

    for( let element of logInForm.elements ) {
        if ( element.name.length> 0) {
            formData[element.name] = element.value;
        }
    }
    
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg) {
            return console.error(msg)
        }
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(console.error)
})


function handleCredentialResponse(response) {
    // Google token
    const body = { id_token: response.credential }
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(({token}) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.log);
}

const button = document.getElementById('google_signout')

button.onclick = () => {
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });
}