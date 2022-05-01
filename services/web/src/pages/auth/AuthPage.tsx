import React from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import Http from '../../http/Http';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {

    const navigate = useNavigate();

    const successResponseGoogle = async(response: GoogleLoginResponse) => {
        const req = await Http.Users.login_users_with_gmail(response.profileObj.email, response.profileObj.name);
        if (req) {
            navigate('/projects');
        }
    }

    const errorResponseGoogle = () => {
        alert('Error while trying to authentificate with google account');
    }

    return (
        <React.Fragment>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={successResponseGoogle}
                onFailure={errorResponseGoogle}
                cookiePolicy={'single_host_origin'}
            />,
        </React.Fragment>
    )
}

export default AuthPage;