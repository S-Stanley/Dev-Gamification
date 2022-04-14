import React from "react";
import { useLocation } from 'react-router-dom'

import Http from "../../http/Http";
import ILadder from "../../interfaces/ILadder";

function HomePage(){

    const location = useLocation();

    const [ladder, setLadder] = React.useState<ILadder[]>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    async function fetch_data() {
        const data: ILadder[] = await Http.Gitlab.fetch_data_from_gitlab(
            location.state['access_token'],
            location.state['refresh_token'],
            location.state['basic_auth'],
            location.state['uriGitlab'] ?? 'https://gitlab.com',
        );
        if (data) {
            setLadder(data);
        }
        setLoading(false);
    }

    React.useEffect(() => {
        fetch_data();
    }, [ false ]);

    return (
        <React.Fragment>
            { loading ? (
                <div>
                    <p>Loading.. please wait</p>
                </div>
            ) : (
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
                                        <td>{x.username}</td>
                                        <td>{x.merges}</td>
                                        <td>{x.level}</td>
                                        <td>{x.grade}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </React.Fragment>
    );
}

export default HomePage;