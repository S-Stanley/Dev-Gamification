import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import ILadder from "../../interfaces/ILadder";
import Http from "../../http/Http";

function HomePage(){

    const [ladder, setLadder] = React.useState<ILadder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [sortBy, setSortBy] = React.useState<string>('');
    const [filterDate, setFilterDate] = React.useState<string>('ALL/ALL');
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
        <div>
            <div>
                { (sortBy !==  '' && sortBy !== 'merges') && (
                    <div>
                        <button onClick={() => setSortBy('merges')}>Sort by merge</button>
                    </div>
                )}
                { (sortBy !== 'weight') && (
                    <div>
                        <button onClick={() => setSortBy('weight')}>Sort by weight</button>
                    </div>
                )}
                { (sortBy !== 'average_weight') && (
                    <div>
                        <button onClick={() => setSortBy('average_weight')}>Sort by average_weight</button>
                    </div>
                )}
            </div>
            <div>
                You can also filter by month and year (format MM/YYYY):
                    <input type="text" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}  />
                    <button onClick={fetch_data} >Save</button>
                    <button
                        onClick={() => {
                            setFilterDate("ALL/ALL");
                            fetch_data();
                        }}
                    >
                        Reset
                    </button>
            </div>
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
        </div>
    );
}

export default HomePage;
