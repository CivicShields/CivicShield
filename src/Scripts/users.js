

export const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
    fullname: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
};