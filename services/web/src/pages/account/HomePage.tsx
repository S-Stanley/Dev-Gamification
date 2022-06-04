import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import ILadder from "../../interfaces/ILadder";
import Http from "../../http/Http";
import { Button, Stack, TextField, Container, Typography } from "@mui/material";

function HomePage(){

    const [ladder, setLadder] = React.useState<ILadder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [sortBy, setSortBy] = React.useState<string>('');
    const [filterDate, setFilterDate] = React.useState<string>('ALL/ALL');
    const [showFilter, setShowFilter] = React.useState<boolean>(false);
    const { repo_id } = useParams();

    const navigate = useNavigate();

    const fetch_data = async () => {
        if (filterDate.split('/').length !== 2)
        {
            alert("Wrong format date");
            return ;
        }
        setLoading(true);
        const req = await Http.Ladder.getLadder(repo_id, sortBy, filterDate);
        if (req){
            setLadder(req);
        }
        setLoading(false);
    }

    React.useEffect(() => {
        fetch_data();
    }, [sortBy]);

    if (loading) {
        return (
            <React.Fragment>
                <p>Loading, please wait.</p>
            </React.Fragment>
        )
    }

    if (ladder.length === 0) {
        return (
            <React.Fragment>
                <p>We don't have any data for the moment. Data is fetch once a day at midnight</p>
            </React.Fragment>
        )
    }

    return (
        <Container>
            <Stack spacing={2} direction='row' style={{paddingTop: '30px', paddingBottom: '30px'}} justifyContent='center'>
                { (sortBy !==  '' && sortBy !== 'merges') && (
                        <Button variant='contained' onClick={() => setSortBy('merges')}>Sort by merge</Button>
                )}
                { (sortBy !== 'weight') && (
                        <Button variant='contained' onClick={() => setSortBy('weight')}>Sort by weight</Button>
                )}
                { (sortBy !== 'average_weight') && (
                        <Button variant='contained' onClick={() => setSortBy('average_weight')}>Sort by average_weight</Button>
                )}
                { (filterDate === 'ALL/ALL') && (
                        <Button
                            variant='contained'
                            onClick={() => {
                                if (showFilter && filterDate !== 'ALL/ALL') {
                                    setFilterDate('ALL/ALL');
                                    fetch_data();
                                }
                                setShowFilter(!showFilter);
                            }}
                        >
                            { showFilter ? 'Reset filter by month' : 'Filter by month' }
                        </Button>
                )}
            </Stack>
            <div>
                { showFilter &&
                    <div>
                        <hr/>
                        <Stack style={{paddingBottom: '40px', paddingTop: '30px'}} spacing={2} justifyContent='left' direction='row'>
                            <TextField size='small' type="text" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}  label='format MM/YYYY' />
                                <Button variant='contained' onClick={fetch_data} >Save</Button>
                                <Button
                                    variant='contained'
                                    onClick={() => {
                                        setFilterDate("ALL/ALL");
                                        fetch_data();
                                    }}
                                >
                                    Reset
                                </Button>
                        </Stack>
                    </div>
                }
            </div>
            <Typography>
                {`sorted by: ${sortBy ? sortBy.replace('_', ' ') : 'merges'}`}
            </Typography>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Username</th>
                            <th>Merges</th>
                            <th>Level</th>
                            <th>Weight</th>
                            <th>Average weight</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ladder.map((x, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td onClick={() => navigate(`/graph?login=${x.username}`)} style={{textDecoration: 'underline'}}>{x.username}</td>
                                    <td>{x.merges}</td>
                                    <td>{x.level}</td>
                                    <td>{x.weight}</td>
                                    <td>{x.average_weight}</td>
                                    <td>{x.grade}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Container>
    );
}

export default HomePage;
