import axios from 'axios';
import Config from '../Config';

const login_users_with_gmail = async(email: string, name: string) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        const req = await axios.post(`${Config.api}/users/auth/google`, formData);
        return (req.data);
    } catch (e) {
        console.error(e);
        alert('There was an error on our side, please try again later');
    }
}

const Users = {
    login_users_with_gmail,
}

export default Users;