
const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://node-rest-course.herokuapp.com/api/auth/';

let socket = null;
let user = null;


// HTML References
const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMsgs = document.querySelector('#ulMsgs');
const btnExit = document.querySelector('#btnExit');
const sendButton = document.querySelector('#send-button');


const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';


    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('There is not a valid token');
    }

    const resp = await fetch(url, {
        headers: {
            'x-token': token
        }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await connectSocket();

}



const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket connected');
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });

    socket.on('receive-msg', showMessages);

    socket.on('active-users', showUsers);

    socket.on('private-msg', ({ from, msg }) => {
        ulMsgs.innerHTML += `
        <li>
            <p>
                <span class="text-primary">(private) ${from}</span>
                <span>${msg}</span>
            </p>
        </li>
    `
    });
}

// Helpers

const sendMsg = () => {
    const msg = txtMsg.value;
    const uid = txtUid.value;

    let text = msg.trim();

    if (text.length === 0) { return; }

    socket.emit('send-msg', { msg: text, uid })
    txtMsg.value = '';
}

const showUsers = (users = []) => {

    users = users.filter(u => {
        return u.uid !== user.uid
    });

    users.forEach(({ name, uid }) => {

        const li = document.createElement('li');
        const p = document.createElement('p');
        const h5 = document.createElement('h5');
        h5.innerText = name;
        h5.setAttribute('class', 'text-success');
        const span = document.createElement('span');
        span.setAttribute('class', 'fs-6 text-muted');
        span.textContent = uid;
        const div = document.createElement('div');
        div.setAttribute('class', 'input-group-append');
        const button = document.createElement('button');
        button.setAttribute('class', 'btn btn-primary ');
        button.textContent = 'select';
        button.addEventListener('click', () => { selectUser(uid) });
        div.appendChild(button);

        // p.setAttribute('class', 'input-group mb-2')
        p.append(h5, span, div);
        li.appendChild(p);
        ulUsers.appendChild(li);
    });
}

const showMessages = (msgs = []) => {
    let msgsHTML = '';
    msgs.forEach(({ name, msg }) => {
        msgsHTML += `
            <li>
                <p>
                    <span class="text-primary">${name}</span>
                    <span>${msg}</span>
                </p>
            </li>
        `
    });
    ulMsgs.innerHTML = msgsHTML;
}

const selectUser = (text) => {
    txtUid.value = text;
}

// Events

sendButton.addEventListener('click', sendMsg)

txtMsg.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode !== 13) { return; }
    sendMsg();
})

btnExit.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
})

const main = async () => {
    await validateJWT();
}

main();

