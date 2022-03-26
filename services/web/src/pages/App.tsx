import React from "react";
import Utils from "../utils/Utils";

function App(){
    return (
        <React.Fragment>
            Welcome to purpev

            <div>
                <a href={Utils.Gitlab.get_auth_uri()}><button>Signup with gitlab</button></a>
            </div>
        </React.Fragment>
    );
}

export default App;