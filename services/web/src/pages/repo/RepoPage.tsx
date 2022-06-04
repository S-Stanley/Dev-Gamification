import React from 'react';
import Http from '../../http/Http';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

interface RepoInterface {
    _id: string,
    uri: string,
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'center',
}));

const RepoPage = () => {

    const [allRepo, setAllRepo] = React.useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const get_all_repo = async() => {
        const user_id: string = location.state['user_id'] || '';
        const req = await Http.Repo.get_all_repo(user_id);
        if (req) {
            setAllRepo(req);
        }
    }

    React.useEffect(() => {
        get_all_repo();
    }, [false]);

    return (
        <React.Fragment>
            <Grid>
                <Box sx={{ width: '100%' }} style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                    <Grid container justifyContent='center'>
                        <Button
                            onClick={() => navigate('/repo/create', {
                                state: {
                                    user_id: location.state['user_id'] || '',
                                }
                            })}
                            variant='contained'
                        >
                            Add a new repo
                        </Button>
                    </Grid>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Grid container justifyContent='center' rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    { allRepo.map((repo: RepoInterface) => {
                        return (
                            <Grid item xs={8}>
                                <Item
                                    key={repo._id}
                                    onClick={() => navigate(`/ladder/${repo._id}`, {
                                        state: {
                                            user_id: location.state['user_id'] || '',
                                        }
                                    })}
                                    style={{cursor: 'pointer'}}
                                >
                                    <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                                        <div style={{width: '100%'}}>
                                            <Avatar src="/static/images/avatar/1.jpg" style={{margin: 'auto'}}/>
                                        </div>
                                        <div style={{width: '100%', margin: 'auto'}}>
                                            {repo.uri}
                                        </div>
                                    </div>
                                </Item>
                            </Grid>
                        )
                    })}
                    </Grid>
                </Box>
            </Grid>
        </React.Fragment>
    )
}

export default RepoPage;