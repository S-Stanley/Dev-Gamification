import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Http from '../../http/Http';
import base64 from 'base-64';
import { TextField, Box, Typography, Button, Grid } from '@mui/material';

const CreateRepoPage = () => {

    const [personalToken, setPersonalToken] = React.useState<string>('');
    const [uri, setUri] = React.useState<string>();
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
            <Grid container justifyContent='center' style={{paddingTop: '40px', textAlign: 'center'}}>
                <Typography variant='h3'>
                    Add a new repository
                </Typography>
            </Grid>
            <div style={{paddingTop: '40px'}}>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                    justifyContent='center'
                >
                    <Grid container justifyContent='center'>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <TextField value={personalToken} onChange={(e) => setPersonalToken(e.target.value)} label='Personal token'/>
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <TextField value={uri} onChange={(e) => setUri(e.target.value)} label='Host where the repo is stored' helperText='e.g: https://gitlab.com' />
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <TextField value={basicAuthLogin} onChange={(e) => setBasicAuthLogin(e.target.value)} label='Login basic auth' />
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            <TextField value={basicAuthPassowrd} onChange={(e) => setBasicAuthPassowrd(e.target.value)} label='Password basic auth'/>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent='center' style={{paddingTop: '30px'}}>
                    <Button
                            onClick={onSubmit}
                            variant='contained'
                        >
                            Save
                        </Button>
                    </Grid>
                </Box>
            </div>
        </React.Fragment>
    )
}

export default CreateRepoPage;