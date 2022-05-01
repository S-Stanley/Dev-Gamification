import React from 'react';
import Http from '../../http/Http';
import { useLocation, useNavigate } from 'react-router-dom';

interface RepoInterface {
    _id: string,
    uri: string,
}

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
            <div>
                <button
                    onClick={() => navigate('/repo/create', {
                        state: {
                            user_id: location.state['user_id'] || '',
                        }
                    })}
                >
                    Add a new repo
                </button>
            </div>
            <div>
                { allRepo.map((repo: RepoInterface) => {
                    return (
                        <div
                            key={repo._id}
                            onClick={() => navigate(`/ladder/${repo._id}`, {
                                state: {
                                    user_id: location.state['user_id'] || '',
                                }
                            })}
                        >
                            {repo.uri}
                        </div>
                    )
                })}
            </div>
        </React.Fragment>
    )
}

export default RepoPage;