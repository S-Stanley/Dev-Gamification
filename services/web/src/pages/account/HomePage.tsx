import React from "react";
import { useNavigate } from 'react-router-dom'
import ILadder from "../../interfaces/ILadder";
import Http from "../../http/Http";

function HomePage(){

    const [ladder, setLadder] = React.useState<ILadder[]>([]);

    const navigate = useNavigate();

    const fetch_data = async () => {
        const username = localStorage.getItem('username');
        if (!username){
            alert('Cannot find your username, please try to login again.');
            return ;
        }
        const req = await Http.Ladder.getLadder(username);
        if (req){
            setLadder(req);
        }
    }

    React.useEffect(() => {
        fetch_data();
    }, [false]);

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
