import axios from 'axios';
import Config from '../Config';

const create_repo = async(user_id: string, personal_token: string, uri: string, basic_auth: string) => {
    try {
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('personal_token', personal_token);
        formData.append('uri', uri);
        if (basic_auth)
            formData.append('basic_auth', basic_auth);
        const req = await axios.post(`${Config.api}/repo/`, formData);
        return (req.data);
    } catch (e) {
        console.error(e);
        alert('Error');
    }
}

const get_all_repo = async(user_id: string) => {
    try {
        const req = await axios.get(`${Config.api}/repo/${user_id}`);
        return (req.data);
    } catch (e) {
        console.error(e);
        alert('Error');
    }
}

const Repo = {
    create_repo,
    get_all_repo,
}

export default Repo;