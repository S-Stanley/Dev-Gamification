import React from 'react';
import MergePerWeek from '../../exports/total-merge-bar';
import Http from '../../http/Http';

const GraphPage = () => {
    const [dataset, setDataset] = React.useState<number[]>([]);

    React.useMemo(async() => {
        const params = new URLSearchParams(window.location.search).toString();
        if (params){
            const login = params.split('&')[0].split('=')[1];
            const req = await Http.Graph.getMergePerWeek(login);
            if (req) {
                setDataset(req);
            }
        }
    }, []);

    return (
        <React.Fragment>
            <MergePerWeek
                dataset={dataset}
            />
        </React.Fragment>
    )
}

export default GraphPage;