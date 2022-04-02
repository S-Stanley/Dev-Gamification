import React from "react";
import Utils from "../utils/Utils";

function App(){

    const [isSelfHosted, setIsSelfHosted] = React.useState<boolean>(undefined);
    const [uriGitlab, setUriGitlab] = React.useState<string>('https://gitlab.com');

    const updateIsHosted = (value: boolean) => {
        if (isSelfHosted === undefined || value !== isSelfHosted)
            setIsSelfHosted(value);
    }

    return (
        <React.Fragment>
            Welcome to purpev

            <div>
                <form>
                    <p>Do you use self hosted gitlab ?</p>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(true)} />Yes</div>
                    <div><input type='radio' name={'selfHostedRadio'} onClick={() => updateIsHosted(false)} />Non</div>
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
                            <a href={Utils.Gitlab.get_auth_uri(uriGitlab)}><button>Signup with gitlab</button></a>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    );
}

export default App;