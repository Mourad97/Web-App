import axios from 'axios';

const Auth = {
    login: user => {
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = user.token;
    },
    init: () => {
        let user = JSON.parse(localStorage.getItem('user'));
        axios.defaults.headers.common['Authorization'] = user !== null ? user.token : '';
    },
    auth: () => localStorage.getItem('user') !== null,
    guest: () => localStorage.getItem('user') === null,
    logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('user');
    },
    getToken: () => {
        let user = JSON.parse(localStorage.getItem('user'));
        return user !== null ? user.token : '';
    }
};

export default Auth;