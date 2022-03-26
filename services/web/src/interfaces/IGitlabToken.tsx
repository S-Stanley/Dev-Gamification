interface IGitlabToken {
    access_token: string,
    created_at: number,
    expires_in: number,
    refresh_token: string,
    scope: string,
    token_type: string,
}

export default IGitlabToken;