import axios from 'axios';

import Config from '../Config';

import IGitlabToken from '../interfaces/IGitlabToken';
import ILadder from '../interfaces/ILadder';

async function get_token(code: string): Promise<IGitlabToken | null>{
    try {
        const req = await axios.post("https://gitlab.com/oauth/token", {
            client_id: process.env.REACT_APP_CLIENT_ID,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
        });
        return (req.data)
    }
    catch (e) {
        alert("There was an issue on our sidde, please try again later");
        return (null);
    }
}

async function fetch_data_from_gitlab(access_token: string, refresh_token :string): Promise<ILadder[] | null>{
    try {
        const formData = new FormData();
        formData.append('access_token', access_token);
        formData.append('refresh_token', refresh_token);
        const req = await axios.post(`${Config.api}/fetch`, formData);
        return (req.data);
    }
    catch (e) {
        alert("There was an issue on our sidde, please try again later");
        return (null);
    }
}

export default {
    get_token,
    fetch_data_from_gitlab,
}