import React from "react";
import { useNavigate, useParams } from 'react-router-dom'
import ILadder from "../../interfaces/ILadder";
import Http from "../../http/Http";

function HomePage(){

    const [ladder, setLadder] = React.useState<ILadder[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const { repo_id } = useParams();

    const navigate = useNavigate();

    const fetch_data = async () => {
        const req = await Http.Ladder.getLadder(repo_id);
        if (req){
            setLadder(req);
        }
        setLoading(false);
    }

    React.useEffect(() => {
        fetch_data();
    }, [false]);

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
            <table className="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Merges</th>
                        <th>Level</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {ladder.map((x, index) => {
                        return (
                            <tr key={index}>
                                <td onClick={() => navigate(`/graph?login=${x.username}`)} style={{textDecoration: 'underline'}}>{x.username}</td>
                                <td>{x.merges}</td>
                                <td>{x.level}</td>
                                <td>{x.grade}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default HomePage;
