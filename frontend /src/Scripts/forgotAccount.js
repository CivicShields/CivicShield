import { userInfo } from "./users.js";
import { submit } from "./login.js";

submit();

let searchButton = document.querySelector('.search-button');
let emailValue = document.querySelector('.Email');

function findAccount(){
    searchButton.addEventListener('click', () => {
        if(emailValue.value === userInfo.email || emailValue.value === userInfo.mobileNum){
            console.log('account found', userInfo);
        } else {
            console.log('account not found');
        }
        emailValue.value = '';
    })
}

findAccount()