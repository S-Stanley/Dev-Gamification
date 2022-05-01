import React from 'react';
import Http from "../../http/Http";
import { useLocation, useNavigate } from 'react-router-dom'

const LoadingPage = () => {

    const [error, setError] = React.useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    async function fetch_data() {
        const data: {username: string} = await Http.Gitlab.fetch_data_from_gitlab(
            location.state['access_token'],
            location.state['refresh_token'],
            location.state['basic_auth'],
            location.state['uriGitlab'] ?? 'https://gitlab.com',
        );
        if (data) {
            localStorage.setItem('username', data.username);
            navigate('/home');
        } else {
            setError(true);
        }
    }

    React.useEffect(() => {
        fetch_data();
    });

    if (error) {
        return (
            <React.Fragment>
                <p>There was an error on our side, please try again later.</p>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <p>Loading..please wait</p>
        </React.Fragment>
    )
}

export default LoadingPage;