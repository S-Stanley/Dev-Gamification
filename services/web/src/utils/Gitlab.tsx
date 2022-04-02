function get_auth_uri(uriGitlab: string = 'https://gitlab.com'): string {
    localStorage.setItem('uriGitlab', uriGitlab);
	return (`${uriGitlab}/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&state=${process.env.REACT_APP_STATE}&scope=${process.env.REACT_APP_SCOPE}`)
}

export default {
    get_auth_uri,
};