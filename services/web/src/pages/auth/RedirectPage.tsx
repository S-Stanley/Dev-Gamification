import React from "react";
import Http from "../../http/Http";
import { useNavigate } from 'react-router-dom'
import IGitlabToken from "../../interfaces/IGitlabToken";

function RedirectPage() {

    const navigate = useNavigate();

    let search = window.location.search;
    let params = new URLSearchParams(search);

    async function get_token(){
        const code = params.get('code') || "";
        if (!code) {
            return ;
        }
        const authorization: IGitlabToken | null = await Http.Gitlab.get_token(code);
        if (!authorization) {
            return ;
        }
        navigate("/loading", {
            state: {
                access_token: authorization.access_token,
                created_at: authorization.created_at,
                expires_in: authorization.expires_in,
                refresh_token: authorization.refresh_token,
                scope: authorization.scope,
                token_type: authorization.token_type,
            }
        })
    }

    React.useEffect(() => {
        get_token();
    });

    return (
        <React.Fragment></React.Fragment>
    );
}

export default RedirectPage;