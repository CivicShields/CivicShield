import { userInfo } from "../../Scripts/users.js";


let loginForm = document.querySelector('form');

export function submit() {
    loginForm.addEventListener('submit', event => {
        let contact = new FormData(loginForm).get('contact');
        let password = new FormData(loginForm).get('password');
        verifyUser(contact, password);
        event.preventDefault();
        loginForm.elements[0].innerHTML = '';
        loginForm.elements[1].innerHTML = ''
    })
}

function verifyUser(contact, password) {
    if ((contact === userInfo.email || contact === userInfo.mobileNum) && password === userInfo.password) {
        console.log('login');
    } else if (!(contact === userInfo.email || contact === userInfo.mobileNum)) {
        console.log('incorrect email or number');
    } else if (!(password === userInfo.password)) {
        console.log('incorrect password');
    }
}

submit();