import { userInfo } from "../../Scripts/users.js";

const createUser = () => {
    let form = document.querySelector("signupform");
    form.addEventListener('submit', event => {
        userInfo.fullname = new FormData(form).get('fullName');
        userInfo.email = new FormData(form).get('emailDetail');
        userInfo.phone = new FormData(form).get('phone');
        if (new FormData(form).get('first-pass') === new FormData(form).get("confirm-pass")) {
            userInfo.password = new FormData(form).get('first-pass');
        } else {
            console.log("passwords dont match")
        }


        event.preventDefault();
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    })
}

export default createUser;
