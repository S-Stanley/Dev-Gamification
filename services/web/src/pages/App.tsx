import React from "react";
import Utils from "../utils/Utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import base64 from 'base-64';

const SelfHostedGitlab = ({ userAccessToken }) => {

    const [isSelfHosted, setIsSelfHosted] = React.useState<boolean>(undefined);
    const [uriGitlab, setUriGitlab] = React.useState<string>('https://gitlab.com');
    const [isBasicAuth, setIsBasicAuth] = React.useState<boolean>(false);
    const [loginBasicAuth, setLoginBasicAuth] = React.useState<string>('');
    const [passBasicAuth, setPassBasicAuth] = React.useState<string>('');

    const notify = (msg: string) => toast.error(msg);
    const navigate = useNavigate();

    const updateIsHosted = (value: boolean) => {
        if (isSelfHosted === undefined || value !== isSelfHosted)
            setIsSelfHosted(value);
    }

    const onSubmit = (): void => {
        if (isSelfHosted)
        {
            if (!uriGitlab) {
                notify("Gitlab host url cannot be empty on self hosted");
                return ;
            }
            if (uriGitlab.search('http') !== 0)
            {
                notify("Gitlab host url cannot need to start by http or https");
                return ;
            }
            if (uriGitlab[uriGitlab.length - 1] === '/')
            {
                notify("Gitlab host url cannot end with a slash (/)");
                return ;
            }
        }
        const basic_auth = base64.encode(`${loginBasicAuth}:${passBasicAuth}`);
        if (userAccessToken) {
            navigate('/home', {
                state: {
                    access_token: userAccessToken,
                    refresh_token: '',
                    type: 'personal-access-token',
                    basic_auth: basic_auth,
                    uriGitlab: uriGitlab,
                }
            });
        } else {
            window.location.replace(Utils.Gitlab.get_auth_uri(uriGitlab));
        }
    }

    return (
        <div>
            <div>
                <div>
                    <p>Do you use basic-auth ?</p>
                    <div><input type='radio' name='basic-auth' onClick={() => setIsBasicAuth(true)} />Yes</div>
                    <div><input type='radio' name='basic-auth' onClick={() => setIsBasicAuth(false)}/>No</div>
                </div>
                <div>
                    { isBasicAuth &&
                        <div>
                            <div>
                                <label>Login</label>
                                <input type="text" value={loginBasicAuth} onChange={(e) => setLoginBasicAuth(e.target.value)} />
                            </div>
                            <div>
                                <label>Password</label>
                                <input type="text" value={passBasicAuth} onChange={(e) => setPassBasicAuth(e.target.value)} />
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div>
                <div>
                    <p>Do you use self hosted gitlab ?</p>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(true)} />Yes</div>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(false)} />No</div>
                </div>
                <div>
                    { isSelfHosted !== undefined &&
                        <div>
                            { isSelfHosted === true &&
                                <div>
                                    <label>Please, provide the host of your gitlab selfhosted (should start by http:// or https://): </label>
                                    <input type='text' value={uriGitlab} onChange={e => setUriGitlab(e.target.value)} />
                                </div>
                            }
                            <button onClick={onSubmit}>Signup with gitlab</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

const AuthPersonalAccessToken = ({ userAccessToken, setUserAccessToken }) => {

    return (
        <div>
            <div>
                <p>Please, insert your personal access token</p>
                <input type='text' value={userAccessToken} onChange={(e) => setUserAccessToken(e.target.value)} />
            </div>
        </div>
    )
}

const App = () => {

    const [authMethod, setAuthMethod] = React.useState<string>(null);
    const [userAccessToken, setUserAccessToken] = React.useState('');

    return (
        <React.Fragment>
            Welcome to purpev

            <div>
                <div>
                    <div>Which auth methods do you want to use ?</div>
                    <div>
                        <div><input type='radio' name='auth-method' onClick={() => setAuthMethod('oauth2')} />OAuth2.0</div>
                        <div><input type='radio' name='auth-method' onClick={() => setAuthMethod('personal-token')}/>Personal token</div>
                    </div>
                </div>
                { authMethod &&
                <div>
                    { authMethod === 'personal-token' &&
                        <AuthPersonalAccessToken
                            userAccessToken={userAccessToken}
                            setUserAccessToken={(values: string) => {
                                setUserAccessToken(values);
                            }}
                        />
                    }
                    <SelfHostedGitlab
                        userAccessToken={userAccessToken}
                    />
                </div>
                }
            </div>
            <ToastContainer/>
        </React.Fragment>
    );
}

export default App;