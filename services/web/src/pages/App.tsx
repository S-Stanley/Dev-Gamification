import React from "react";
import Utils from "../utils/Utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App(){
    const [isSelfHosted, setIsSelfHosted] = React.useState<boolean>(undefined);
    const [uriGitlab, setUriGitlab] = React.useState<string>('https://gitlab.com');

    const notify = (msg: string) => toast.error(msg);

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
        window.location.replace(Utils.Gitlab.get_auth_uri(uriGitlab));
    }

    return (
        <React.Fragment>
            Welcome to purpev

            <div>
                <form>
                    <p>Do you use self hosted gitlab ?</p>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(true)} />Yes</div>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(false)} />No</div>
                </form>
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
            <ToastContainer/>
        </React.Fragment>
    );
}

export default App;