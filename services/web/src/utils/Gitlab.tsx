function get_auth_uri(): string {
	return (`https://gitlab.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&state=${process.env.REACT_APP_STATE}&scope=${process.env.REACT_APP_SCOPE}`)
}

export default {
    get_auth_uri,
};