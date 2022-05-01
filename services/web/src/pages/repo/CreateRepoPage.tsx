import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Http from '../../http/Http';
import base64 from 'base-64';

const CreateRepoPage = () => {

    const [personalToken, setPersonalToken] = React.useState<string>('');
    const [uri, setUri] = React.useState<string>('https://gitlab.com');
    const [basicAuthLogin, setBasicAuthLogin] = React.useState<string>('');
    const [basicAuthPassowrd, setBasicAuthPassowrd] = React.useState<string>('');

    const location = useLocation();
    const navigate = useNavigate();

    const onSubmit = async() => {
        let basic_auth = undefined;
        if (basicAuthLogin || basicAuthPassowrd) {
            basic_auth = base64.encode(`${basicAuthLogin}:${basicAuthPassowrd}`);
        }
        const req = await Http.Repo.create_repo(
            location.state['user_id'],
            personalToken,
            uri,
            basic_auth,
        )
        if (req) {
            navigate('/repo', {
                state: {
                    user_id: location.state['user_id'],
                }
            });
        }
    }

    return (
        <React.Fragment>
            <div>
                <div>
                    <label>Personal token* <a href="https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html" target='_blank' rel='noreferrer'>(More info)</a> </label><br />
                    <input value={personalToken} onChange={(e) => setPersonalToken(e.target.value)} /><br />
                </div>
                <div>
                    <label>Host where the repo is stored (ex: https://gitlab.com)*</label><br />
                    <input value={uri} onChange={(e) => setUri(e.target.value)} />
                </div>
                <div>
                    <label>Login basic auth<a href="https://en.wikipedia.org/wiki/Basic_access_authentication" target='_blank' rel='noreferrer'>(More info)</a></label><br />
                    <input value={basicAuthLogin} onChange={(e) => setBasicAuthLogin(e.target.value)} />
                </div>
                <div>
                    <label>Password basic auth<a href="https://en.wikipedia.org/wiki/Basic_access_authentication" target='_blank' rel='noreferrer'>(More info)</a></label><br />
                    <input value={basicAuthPassowrd} onChange={(e) => setBasicAuthPassowrd(e.target.value)} />
                </div>
                <div>
                    <button
                        onClick={onSubmit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default CreateRepoPage;